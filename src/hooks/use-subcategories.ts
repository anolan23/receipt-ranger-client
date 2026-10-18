import { getSubcategories } from '@/lib/api/categories';
import { useQuery } from '@tanstack/react-query';

export function useSubcategories(categoryId?: number | string | null) {
  return useQuery({
    queryKey: ['categories', categoryId, 'subcategories'],
    queryFn: () => getSubcategories(categoryId!),
    enabled: !!categoryId,
  });
}
