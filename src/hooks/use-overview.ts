import { getOverview } from '@/lib/api/analytics';
import { GetOverviewParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useOverview(params: GetOverviewParams) {
  return useQuery({
    queryKey: ['analytics', 'overview', params],
    queryFn: () => getOverview(params),
  });
}
