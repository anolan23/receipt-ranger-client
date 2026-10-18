import { getItem } from '@/lib/api/items';
import { useQuery } from '@tanstack/react-query';

export function useItem(itemId?: number | string) {
  return useQuery({
    queryKey: ['items', itemId],
    queryFn: () => getItem(+itemId!),
    enabled: !!itemId,
  });
}
