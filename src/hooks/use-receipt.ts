import { getReceipt } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceipt(receiptId?: number | string) {
  const id = typeof receiptId === 'string' ? +receiptId : receiptId;
  const fetcher = async function () {
    if (!id) return;
    const receipt = await getReceipt(id);
    return receipt;
  };
  return useSWR(receiptId ? `/receipts/${receiptId}` : undefined, fetcher);
}
