import { getReceipts } from '@/lib/api/receipts';
import useSWR from 'swr';

interface UseReceiptsOptions {
  limit?: number;
}

export function useReceipts(options?: UseReceiptsOptions) {
  const { limit } = options || {};

  const key = limit ? `/receipts?limit=${limit}` : '/receipts';

  return useSWR(key, () => getReceipts({ limit }));
}
