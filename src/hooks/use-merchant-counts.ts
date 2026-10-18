import { getMerchantCounts } from '@/lib/api/analytics';
import { UseMerchantCountsParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useMerchantCounts(params: UseMerchantCountsParams) {
  return useQuery({
    queryKey: ['analytics', 'merchant-counts', params],
    queryFn: () => getMerchantCounts(params),
  });
}
