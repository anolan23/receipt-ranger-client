import { getMerchants } from '@/lib/api/merchants';
import useSWR from 'swr';

export function useMerchants() {
  const key = '/merchants';

  return useSWR(key, getMerchants);
}
