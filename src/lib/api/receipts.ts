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
  task_id: string;
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
        throw new Error('Maximum number of receipt scans reached');
      }
    }
    throw error;
  }
}

export type ReceiptTaskResult = {
  ready: boolean;
  receipt_id: string;
  state: string;
  successful: boolean;
};

export async function pollReceiptTask(taskId: string) {
  const response = await backend.get<ReceiptTaskResult>(
    `/receipts/tasks/${taskId}/status`
  );
  return response.data;
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
