import { getReceipt } from '@/lib/api/receipts';
import { useQuery } from '@tanstack/react-query';

export function useReceipt(receiptId?: string) {
  return useQuery({
    queryKey: ['receipts', receiptId],
    queryFn: () => getReceipt(receiptId!),
    enabled: !!receiptId,
    retry: false,
  });
}
