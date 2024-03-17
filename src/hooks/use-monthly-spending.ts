import { getMonthlySpending } from '@/lib/api/receipts';
import useSWR from 'swr';

// Enhance the hook to optionally accept a year argument
export function useMonthlySpending(year: string | number) {
  // Dynamic API endpoint that includes the year as a query parameter
  const key = `/receipts/monthly-totals?year=${year}`;

  return useSWR(key, () => getMonthlySpending(year));
}
