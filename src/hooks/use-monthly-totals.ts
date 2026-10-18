import { getMonthlyTotals } from '@/lib/api/receipts';
import { UseMonthlyTotalsParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useMonthlyTotals(params: UseMonthlyTotalsParams) {
  return useQuery({
    queryKey: ['analytics', 'monthly-totals', params],
    queryFn: () => getMonthlyTotals(params),
  });
}
