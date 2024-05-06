import { ItemUpdatePayload } from '@/pages/dashboard/receipts/[receiptId]/interfaces';
import axios from 'axios';
import { backend } from '../backend';
import {
  ItemData,
  MonthySpendingData,
  ReceiptData,
  UseMonthlyTotalsParams,
} from '../types';

interface GetReceiptsParams {
  limit?: number;
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

type CreateReceiptResult = {
  receipt_id: string;
};
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
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Maximum number of receipt uploads reached');
      }
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
