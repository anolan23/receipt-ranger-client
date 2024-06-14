import { getItems } from '@/lib/api/items';
import useSWR from 'swr';

export function useItems() {
  const key = `/items`;
  return useSWR(key, getItems);
}
