import { getReceiptItems } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceiptItems(receiptId?: number | string) {
  const id = typeof receiptId === 'string' ? +receiptId : receiptId;

  const fetcher = async function () {
    if (!id) return;
    const receipt = await getReceiptItems(id);
    return receipt;
  };

  const swrResponse = useSWR(
    receiptId ? `/receipts/${receiptId}/items` : undefined,
    fetcher,
    { revalidateOnMount: true }
  );

  return swrResponse;
}
