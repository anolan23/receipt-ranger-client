import { ItemUpdatePayload } from '@/pages/dashboard/receipts/[receiptId]/interfaces';
import axios from 'axios';
import { backend } from '../backend';
import {
  ItemData,
  MonthySpendingData,
  ReceiptData,
  UseMonthlyTotalsParams,
} from '../types';

export interface GetReceiptsParams {
  limit?: number;
  reviewed?: boolean;
}
export async function getReceipts(params?: GetReceiptsParams) {
  const response = await backend.get<ReceiptData[]>('/receipts', { params });
  return response.data;
}

export async function getReceipt(receiptId: string) {
  const response = await backend.get<ReceiptData>(`/receipts/${receiptId}`);
  return response.data;
}

export async function getReceiptItems(receiptId: string) {
  const response = await backend.get<ItemData[]>(
    `/receipts/${receiptId}/items`
  );
  return response.data;
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
export async function getScanUsage() {
  const response = await backend.get<ScanUsage>('/receipts/usage');
  return response.data;
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

export async function createReceipt(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await backend.post<CreateReceiptResult>(
      '/receipts',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Processing happens during the request and takes roughly 8-15s
        timeout: 60_000,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        const data = error.response.data;
        throw new ScanLimitError({
          limit: typeof data?.limit === 'number' ? data.limit : undefined,
          used: typeof data?.used === 'number' ? data.used : undefined,
          resetsAt:
            typeof data?.resets_at === 'string' ? data.resets_at : undefined,
        });
      }
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') throw new Error(detail);
    }
    throw error;
  }
}

export interface ReceiptUpdatePayload {
  items: ItemUpdatePayload[];
  transaction_date?: Date;
  merchant_id: string;
  subtotal: string;
  sales_tax: string;
  total: string;
}

export async function updateReceipt(
  receiptId: string,
  updates: ReceiptUpdatePayload
) {
  const response = await backend.put(`/receipts/${receiptId}`, updates);
  return response.data;
}

export async function updateReceiptReviewStatus(
  receiptId: string,
  reviewed: boolean
) {
  const response = await backend.patch(`/receipts/${receiptId}/review`, {
    reviewed,
  });
  return response.data;
}

export async function deleteReceipt(receipt_id: string) {
  await backend.delete(`/receipts/${receipt_id}`);
}

export async function getMonthlyTotals(params: UseMonthlyTotalsParams) {
  const response = await backend.get<MonthySpendingData[]>(
    `/receipts/monthly-totals`,
    { params }
  );
  return response.data;
}

export async function downloadReceipts() {
  const url = `/receipts/export`;

  // Use Axios to make the GET request
  const response = await backend.get<Blob>(url, { responseType: 'blob' });
  // Create a temporary link element
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(response.data);

  // Set the filename for the downloaded file
  link.download = 'receipts.csv';

  // Append the link to the document body
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Remove the link from the document body
  document.body.removeChild(link);
}
