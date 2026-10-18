import { GetReceiptsParams, getReceipts } from '@/lib/api/receipts';
import { useQuery } from '@tanstack/react-query';

export function useReceipts(params?: GetReceiptsParams) {
  return useQuery({
    queryKey: ['receipts', 'list', params],
    queryFn: () => getReceipts(params),
  });
}
