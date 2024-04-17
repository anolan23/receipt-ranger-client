import { getCategories } from '@/lib/api/categories';
import useSWR from 'swr';

export function useCategories() {
  const key = `/categories`;

  return useSWR(key, getCategories);
}
