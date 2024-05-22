import { GetReceiptsParams, getReceipts } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceipts(params?: GetReceiptsParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    }
  }

  const key = `/receipts?${searchParams.toString()}`;

  return useSWR(key, () => getReceipts(params));
}
