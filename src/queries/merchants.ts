import { getMerchants, searchMerchant } from '@/lib/api/merchants';
import { useQuery } from '@tanstack/react-query';

export const merchantKeys = {
  all: ['merchants'] as const,
  search: (search?: string) => ['merchants', 'search', search] as const,
};

export function useMerchants() {
  return useQuery({ queryKey: merchantKeys.all, queryFn: getMerchants });
}

export function useMerchantSearch(search?: string) {
  return useQuery({
    queryKey: merchantKeys.search(search),
    queryFn: () => searchMerchant(search!),
    enabled: !!search,
  });
}
