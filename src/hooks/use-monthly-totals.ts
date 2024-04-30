import { getMonthlyTotals } from '@/lib/api/receipts';
import { UseMonthlyTotalsParams } from '@/lib/types';
import useSWR from 'swr';

export function useMonthlyTotals(params: UseMonthlyTotalsParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/monthly-totals?${queryString}`;

  return useSWR(key, () => getMonthlyTotals(params));
}
