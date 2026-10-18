import { getTopBaseItems } from '@/lib/api/analytics';
import { UseTopBaseItemsParams } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export function useTopBaseItems(params?: UseTopBaseItemsParams) {
  return useQuery({
    queryKey: ['analytics', 'top-base-items', params],
    queryFn: () => getTopBaseItems(params),
  });
}
