import { getReceiptItems } from '@/lib/api/receipts';
import { useQuery } from '@tanstack/react-query';

export function useReceiptItems(receiptId?: string) {
  return useQuery({
    queryKey: ['receipts', receiptId, 'items'],
    queryFn: () => getReceiptItems(receiptId!),
    enabled: !!receiptId,
    retry: false,
  });
}
