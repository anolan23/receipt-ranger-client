import { getSpendingOverview } from '@/lib/api/analytics';
import { useQuery } from '@tanstack/react-query';

export function useSpendingOverview() {
  return useQuery({
    queryKey: ['analytics', 'spending-overview'],
    queryFn: getSpendingOverview,
  });
}
