import { GetItemsParams, getItems } from '@/lib/api/items';
import { useQuery } from '@tanstack/react-query';

type UseItemsParams = GetItemsParams;

export function useItems(params?: UseItemsParams) {
  return useQuery({
    queryKey: ['items', 'list', params],
    queryFn: () => getItems(params),
  });
}
