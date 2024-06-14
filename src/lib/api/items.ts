import { backend } from '../backend';
import { ItemData } from '../types';

export async function getItems() {
  const response = await backend.get<ItemData[]>(`/items`);
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
