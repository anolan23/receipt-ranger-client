import { getSubcategoryTotals } from '@/lib/api/analytics';
import { UseCategoryTotalsParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useSubcategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: ['analytics', 'subcategory-totals', params],
    queryFn: () => getSubcategoryTotals(params),
  });
}
