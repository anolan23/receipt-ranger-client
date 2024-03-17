import { getSpendingOverview } from '@/lib/api/analytics';
import useSWR from 'swr';

export function useSpendingOverview() {
  const key = `/analytics/spending-overview`;
  return useSWR(key, getSpendingOverview);
}
