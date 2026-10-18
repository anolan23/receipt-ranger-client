import { getMerchants } from '@/lib/api/merchants';
import { useQuery } from '@tanstack/react-query';

export function useMerchants() {
  return useQuery({ queryKey: ['merchants'], queryFn: getMerchants });
}
