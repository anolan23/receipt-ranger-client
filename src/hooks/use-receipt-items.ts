import { getReceiptItems } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceiptItems(receiptId?: string) {
  const fetcher = async function () {
    if (!receiptId) return;
    const receipt = await getReceiptItems(receiptId);
    return receipt;
  };

  const swrResponse = useSWR(
    receiptId ? `/receipts/${receiptId}/items` : undefined,
    fetcher,
    { revalidateOnMount: true }
  );

  return swrResponse;
}
