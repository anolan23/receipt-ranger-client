import { getSubcategoryTotals } from '@/lib/api/analytics';
import { UseCategoryTotalsParams } from '@/lib/types';
import useSWR from 'swr';

export function useSubcategoryTotals(params: UseCategoryTotalsParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/subcategory-totals?${queryString}`;
  return useSWR(key, () => getSubcategoryTotals(params));
}
