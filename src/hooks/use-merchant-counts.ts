import { getMerchantCounts } from '@/lib/api/analytics';
import { UseMerchantCountsParams } from '@/lib/types';
import useSWR from 'swr';

export function useMerchantCounts(params: UseMerchantCountsParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/merchant-counts?${queryString}`;
  return useSWR(key, () => getMerchantCounts(params));
}
