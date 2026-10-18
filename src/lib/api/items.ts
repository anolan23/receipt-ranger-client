import { fetchAllPages, supabase } from '../supabase';
import type { TablesUpdate } from '../database.types';
import { DateInterval, ItemData } from '../types';
import { ITEM_SELECT, toItem } from './mappers';

export interface GetItemsParams extends DateInterval {}

export async function getItems(params?: GetItemsParams) {
  const rows = await fetchAllPages((from, to) => {
    let request = supabase
      .from('items')
      .select(`${ITEM_SELECT}, receipt:receipts!inner(transaction_date)`)
      .order('created_at', { ascending: false });
    if (params?.start_date) {
      request = request.gte('receipt.transaction_date', params.start_date);
    }
    if (params?.end_date) {
      request = request.lte('receipt.transaction_date', params.end_date);
    }
    return request.range(from, to);
  });
  return rows.map((row) => toItem(row as never));
}

export async function getItem(itemId?: number) {
  const { data, error } = await supabase
    .from('items')
    .select(ITEM_SELECT)
    .eq('id', String(itemId))
    .single();
  if (error) throw new Error(error.message);
  return toItem(data as never);
}

const WRITABLE: (keyof ItemData)[] = [
  'subcategory_id',
  'generated_item_name',
  'item_name_raw',
  'quantity',
  'price_per_unit',
  'total_price',
  'base_item_type',
];

export async function updateItem(itemId: number, item: Partial<ItemData>) {
  const changes = Object.fromEntries(
    WRITABLE.filter((key) => key in item).map((key) => [key, item[key]])
  ) as TablesUpdate<'items'>;
  const { data, error } = await supabase
    .from('items')
    .update(changes)
    .eq('id', String(itemId))
    .select(ITEM_SELECT)
    .single();
  if (error) throw new Error(error.message);
  return toItem(data as never);
}
