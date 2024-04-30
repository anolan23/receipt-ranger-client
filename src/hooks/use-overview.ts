import { getOverview } from '@/lib/api/analytics';
import { GetOverviewParams } from '@/lib/types';
import useSWR from 'swr';

export function useOverview(params: GetOverviewParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/overview?${queryString}`;
  return useSWR(key, () => getOverview(params));
}
