import { getSpendingExplorer } from '@/lib/api/analytics';
import { SpendingExplorerParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useSpendingExplorer(params: SpendingExplorerParams) {
  return useQuery({
    queryKey: ['analytics', 'spending-explorer', params],
    queryFn: () => getSpendingExplorer(params),
  });
}
