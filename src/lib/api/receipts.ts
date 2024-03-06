import { backend } from '../backend';
import { ItemData, ReceiptData } from '../types';

export async function getReceipts() {
  const response = await backend.get<ReceiptData[]>('/receipts');
  return response.data;
}

export async function getReceipt(receiptId: number) {
  const response = await backend.get<ReceiptData>(`/receipts/${receiptId}`);
  return response.data;
}

export async function getReceiptItems(receiptId: number) {
  const response = await backend.get<ItemData[]>(
    `/receipts/${receiptId}/items`
  );
  return response.data;
}

export async function createReceipt(object_key: string) {
  const response = await backend.post(`/receipts`, { object_key });
  return response.data;
}

export async function deleteReceipt(receipt_id: number) {
  await backend.delete(`/receipts/${receipt_id}`);
}
