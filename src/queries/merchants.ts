import { queryKeys } from './keys';
import { getMerchants, searchMerchant } from '@/lib/api/merchants';
import { skipToken, useQuery } from '@tanstack/react-query';

export function useMerchants() {
  return useQuery({
    queryKey: queryKeys.merchants.list.queryKey,
    queryFn: getMerchants,
  });
}

export function useMerchantSearch(search?: string) {
  return useQuery({
    queryKey: queryKeys.merchants.search(search).queryKey,
    queryFn: search ? () => searchMerchant(search) : skipToken,
  });
}
