import { getCategoryItems } from '@/lib/api/categories';
import useSWR from 'swr';

export function useCategoryItems(categoryId?: number | string) {
  return useSWR(
    categoryId ? `/categories/${categoryId}/items` : undefined,
    () => (categoryId ? getCategoryItems(categoryId) : undefined)
  );
}
