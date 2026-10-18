import { searchMerchant } from '@/lib/api/merchants';
import { useQuery } from '@tanstack/react-query';

export function useMerchantSearch(search?: string) {
  return useQuery({
    queryKey: ['merchants', 'search', search],
    queryFn: () => searchMerchant(search!),
    enabled: !!search,
  });
}
