import { GetItemsParams, getItems } from '@/lib/api/items';
import useSWR from 'swr';

type UseItemsParams = GetItemsParams;

export function useItems(params?: UseItemsParams) {
  const searchParams = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    }
  }

  const key = `/items?${searchParams.toString()}`;
  return useSWR(key, () => getItems(params));
}
