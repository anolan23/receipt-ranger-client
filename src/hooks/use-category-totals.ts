import { getCategoryTotals } from '@/lib/api/analytics';
import { UseCategoryTotalsParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useCategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: ['analytics', 'category-totals', params],
    queryFn: () => getCategoryTotals(params),
  });
}
