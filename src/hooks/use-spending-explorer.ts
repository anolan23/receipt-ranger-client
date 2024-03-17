import { getSpendingExplorer } from '@/lib/api/analytics';
import { SpendingExplorerParams } from '@/lib/types';
import useSWR from 'swr';

export function useSpendingExplorer(params: SpendingExplorerParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/spending-overview?${queryString}`;
  return useSWR(key, () => getSpendingExplorer(params));
}
