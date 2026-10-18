import { queryKeys } from './keys';
import { GetItemsParams, getItem, getItems, updateItem } from '@/lib/api/items';
import { ItemData } from '@/lib/types';
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export function useItems(params?: GetItemsParams) {
  return useQuery({
    queryKey: queryKeys.items.list(params).queryKey,
    queryFn: () => getItems(params),
  });
}

export function useItem(itemId?: number | string) {
  return useQuery({
    queryKey: queryKeys.items.detail(itemId).queryKey,
    queryFn: itemId ? () => getItem(+itemId) : skipToken,
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      item,
    }: {
      itemId: number;
      item: Partial<ItemData>;
    }) => updateItem(itemId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.items._def });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics._def });
    },
  });
}
