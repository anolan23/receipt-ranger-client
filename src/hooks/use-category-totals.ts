import { getCategoryTotals } from '@/lib/api/analytics';
import { UseCategoryTotalsParams } from '@/lib/types';
import useSWR from 'swr';

export function useCategoryTotals(params: UseCategoryTotalsParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/category-totals?${queryString}`;
  return useSWR(key, () => getCategoryTotals(params));
}
