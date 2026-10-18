import { ItemUpdatePayload } from '@/pages/dashboard/receipts/[receiptId]/interfaces';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { fetchAllPages, requireUserId, supabase } from '../supabase';
import { prepareImage } from '../image';
import {
  ItemData,
  MonthySpendingData,
  ReceiptData,
  UseMonthlyTotalsParams,
} from '../types';
import { ITEM_SELECT, RECEIPT_SELECT, toItem, toReceipt } from './mappers';

export interface GetReceiptsParams {
  limit?: number;
  reviewed?: boolean;
}
export async function getReceipts(params?: GetReceiptsParams) {
  const query = (from: number, to: number) => {
    let request = supabase
      .from('receipts')
      .select(RECEIPT_SELECT)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: true, referencedTable: 'items' });
    if (params?.reviewed !== undefined) {
      request = request.eq('reviewed', params.reviewed);
    }
    return request.range(from, to);
  };

  if (params?.limit) {
    const { data, error } = await query(0, params.limit - 1);
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => toReceipt(row as never));
  }
  const rows = await fetchAllPages(query);
  return rows.map((row) => toReceipt(row as never));
}

const IMAGE_URL_MAX_AGE = 3600;

export async function getReceipt(receiptId: string): Promise<ReceiptData> {
  const { data, error } = await supabase
    .from('receipts')
    .select(RECEIPT_SELECT)
    .eq('id', receiptId)
    .order('created_at', { ascending: true, referencedTable: 'items' })
    .single();
  if (error) throw new Error(error.message);
  const receipt = toReceipt(data as never);

  // The receipts bucket is private: a signed URL works in a plain <img src>.
  if (receipt.object_key) {
    const { data: signed } = await supabase.storage
      .from('receipts')
      .createSignedUrl(receipt.object_key, IMAGE_URL_MAX_AGE);
    receipt.image_url = signed?.signedUrl ?? null;
  }
  return receipt;
}

export async function getReceiptItems(receiptId: string): Promise<ItemData[]> {
  const { data, error } = await supabase
    .from('items')
    .select(ITEM_SELECT)
    .eq('receipt_id', receiptId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => toItem(row as never));
}

export type CreateReceiptResult = {
  receipt_id: string;
  potential_duplicate?: boolean;
  duplicate_receipt_id?: string | null;
};
export type ScanUsage = {
  used: number;
  /** null when the plan has no cap */
  limit: number | null;
  unlimited: boolean;
  resets_at: string;
};

async function errorBody(error: unknown) {
  if (error instanceof FunctionsHttpError) {
    try {
      return {
        status: error.context.status as number,
        body: (await error.context.json()) as Record<string, unknown>,
      };
    } catch {
      return { status: error.context.status as number, body: {} };
    }
  }
  return null;
}

export async function getScanUsage() {
  const { data, error } = await supabase.functions.invoke<ScanUsage>(
    'parse-receipt',
    { method: 'GET' }
  );
  if (error) throw error;
  return data as ScanUsage;
}

/** Thrown when the free plan's scan limit is hit. Fields are set only if the backend sends them. */
export class ScanLimitError extends Error {
  limit?: number;
  used?: number;
  resetsAt?: string;

  constructor(details?: { limit?: number; used?: number; resetsAt?: string }) {
    super('Upgrade to Pro for unlimited Receipt scans');
    this.name = 'ScanLimitError';
    this.limit = details?.limit;
    this.used = details?.used;
    this.resetsAt = details?.resetsAt;
  }
}

/**
 * Uploads the photo to the private receipts bucket, then asks the parse-receipt Edge
 * Function to read it and create the receipt (takes roughly 8-15s).
 */
export async function createReceipt(file: File): Promise<CreateReceiptResult> {
  const image = await prepareImage(file);
  const userId = await requireUserId();
  // Storage policies require the first path segment to be the user's id.
  const path = `${userId}/${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(path, image, { contentType: image.type || 'image/jpeg' });
  if (uploadError) throw new Error(uploadError.message);

  const { data, error } = await supabase.functions.invoke<{
    id: string;
    possible_duplicate_of: string | null;
  }>('parse-receipt', { body: { object_key: path } });

  if (error) {
    const failure = await errorBody(error);
    if (failure) {
      // The backend definitively refused, so don't leave the image behind.
      await supabase.storage.from('receipts').remove([path]);
      const { body } = failure;
      if (failure.status === 429) {
        throw new ScanLimitError({
          limit: typeof body.limit === 'number' ? body.limit : undefined,
          used: typeof body.used === 'number' ? body.used : undefined,
          resetsAt:
            typeof body.resets_at === 'string' ? body.resets_at : undefined,
        });
      }
      if (typeof body.detail === 'string') throw new Error(body.detail);
    }
    throw error;
  }
  return {
    receipt_id: data!.id,
    potential_duplicate: data!.possible_duplicate_of !== null,
    duplicate_receipt_id: data!.possible_duplicate_of,
  };
}

export interface ReceiptUpdatePayload {
  items: ItemUpdatePayload[];
  transaction_date?: Date;
  merchant_id: string;
  subtotal: string;
  sales_tax: string;
  total: string;
}

const toNumber = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? undefined : Number(value);

export async function updateReceipt(
  receiptId: string,
  updates: ReceiptUpdatePayload
) {
  const { error } = await supabase.rpc('update_receipt', {
    p_receipt_id: receiptId,
    p_transaction_date: updates.transaction_date?.toISOString(),
    p_subtotal: toNumber(updates.subtotal),
    p_sales_tax: toNumber(updates.sales_tax),
    p_total: toNumber(updates.total),
    p_merchant_id: updates.merchant_id || undefined,
    p_items: updates.items.map((item) => ({
      item_id: item.item_id ?? null,
      name: item.name,
      quantity: item.quantity ?? null,
      price: toNumber(item.price),
      subcategory_id: item.subcategory_id ?? null,
    })),
  });
  if (error) throw new Error(error.message);
}

export async function updateReceiptReviewStatus(
  receiptId: string,
  reviewed: boolean
) {
  const { error } = await supabase
    .from('receipts')
    .update({ reviewed })
    .eq('id', receiptId);
  if (error) throw new Error(error.message);
}

export async function deleteReceipt(receipt_id: string) {
  const { data } = await supabase
    .from('receipts')
    .select('object_key')
    .eq('id', receipt_id)
    .maybeSingle();
  const { error } = await supabase.from('receipts').delete().eq('id', receipt_id);
  if (error) throw new Error(error.message);
  // Best effort: the row is gone either way.
  if (data?.object_key) {
    await supabase.storage.from('receipts').remove([data.object_key]);
  }
}

export async function getMonthlyTotals(params: UseMonthlyTotalsParams) {
  const { data, error } = await supabase.rpc('analytics_monthly_totals', {
    p_start_date: params.start_date,
    p_end_date: params.end_date,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map(
    (row): MonthySpendingData => ({
      month_date: row.month_date,
      total: String(row.total),
    })
  );
}

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function downloadReceipts() {
  const rows = await fetchAllPages((from, to) =>
    supabase
      .from('receipts')
      .select(
        'id, created_at, transaction_date, subtotal, sales_tax, total_amount, merchant:merchants(name), category:categories(label)'
      )
      .order('transaction_date', { ascending: false })
      .range(from, to)
  );

  const header = [
    'id',
    'scanned_date',
    'merchant_name',
    'category_name',
    'transaction_date',
    'subtotal',
    'sales_tax',
    'total_amount',
  ];
  const lines = rows.map((row) => {
    const { merchant, category } = row as unknown as {
      merchant: { name: string } | null;
      category: { label: string } | null;
    };
    return [
      row.id,
      row.created_at,
      merchant?.name,
      category?.label,
      row.transaction_date,
      row.subtotal,
      row.sales_tax,
      row.total_amount,
    ]
      .map(csvCell)
      .join(',');
  });

  const url = URL.createObjectURL(
    new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'receipts.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
