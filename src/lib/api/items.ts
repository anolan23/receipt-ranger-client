import { backend } from '../backend';
import { DateInterval, ItemData } from '../types';

export interface GetItemsParams extends DateInterval {}

export async function getItems(params?: GetItemsParams) {
  const response = await backend.get<ItemData[]>(`/items`, { params });
  return response.data;
}
export async function getItem(itemId?: number) {
  const response = await backend.get<ItemData>(`/items/${itemId}`);
  return response.data;
}

export async function updateItem(itemId: number, item: Partial<ItemData>) {
  const response = await backend.patch<ItemData>(`/items/${itemId}`, item);
  return response.data;
}
