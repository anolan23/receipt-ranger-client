import { searchMerchant } from '@/lib/api/merchants';
import useSWR from 'swr';

export function useMerchantSearch(search?: string) {
  const queryString = new URLSearchParams({ q: search } as any).toString();
  const key = `/merchants/search?${queryString}`;
  return useSWR(search && key, () =>
    search ? searchMerchant(search) : undefined
  );
}
