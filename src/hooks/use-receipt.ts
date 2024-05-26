import { getReceipt } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceipt(receiptId?: string) {
  const fetcher = async function () {
    if (!receiptId) return;
    const receipt = await getReceipt(receiptId);
    return receipt;
  };
  return useSWR(receiptId ? `/receipts/${receiptId}` : undefined, fetcher, {
    shouldRetryOnError: false,
  });
}
