import { getItem } from '@/lib/api/items';
import useSWR from 'swr';

export function useItem(itemId?: number | string) {
  const id = typeof itemId === 'string' ? +itemId : itemId;
  const fetcher = async function () {
    if (!id) return;
    const item = await getItem(id);
    return item;
  };
  return useSWR(itemId ? `/items/${itemId}` : undefined, fetcher);
}
