import { GetItemsParams, getItem, getItems, updateItem } from '@/lib/api/items';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ItemData } from '@/lib/types';
import { analyticsKeys } from './analytics';

export const itemKeys = {
  all: ['items'] as const,
  list: (params?: GetItemsParams) => ['items', 'list', params] as const,
  detail: (id?: number | string) => ['items', id] as const,
};

export function useItems(params?: GetItemsParams) {
  return useQuery({
    queryKey: itemKeys.list(params),
    queryFn: () => getItems(params),
  });
}

export function useItem(itemId?: number | string) {
  return useQuery({
    queryKey: itemKeys.detail(itemId),
    queryFn: () => getItem(+itemId!),
    enabled: !!itemId,
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, item }: { itemId: number; item: Partial<ItemData> }) =>
      updateItem(itemId, item),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: itemKeys.all }),
        queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
      ]),
  });
}
