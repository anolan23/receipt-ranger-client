import { getCategory } from '@/lib/api/categories';
import useSWR from 'swr';

export function useCategory(categoryId?: number | string) {
  return useSWR(categoryId ? `/categories/${categoryId}` : undefined, () =>
    categoryId ? getCategory(categoryId) : undefined
  );
}
