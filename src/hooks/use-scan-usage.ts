import { getScanUsage } from '@/lib/api/receipts';
import { useQuery } from '@tanstack/react-query';

export function useScanUsage() {
  return useQuery({ queryKey: ['receipts', 'usage'], queryFn: getScanUsage });
}
