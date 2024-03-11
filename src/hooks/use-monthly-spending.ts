import { getMonthlySpending } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useMonthlySpending() {
  return useSWR('/receipts/monthly-totals', getMonthlySpending);
}
