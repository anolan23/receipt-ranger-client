import { getSubcategories } from '@/lib/api/categories';
import useSWR from 'swr';

export function useSubcategories(categoryId?: number | string | null) {
  return useSWR(
    categoryId ? `/categories/${categoryId}/subcategories` : undefined,
    () => (categoryId ? getSubcategories(categoryId) : undefined)
  );
}
