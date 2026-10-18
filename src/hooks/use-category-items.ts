import { getCategoryItems } from '@/lib/api/categories';
import { useQuery } from '@tanstack/react-query';

export function useCategoryItems(categoryId?: number | string) {
  return useQuery({
    queryKey: ['categories', categoryId, 'items'],
    queryFn: () => getCategoryItems(categoryId!),
    enabled: !!categoryId,
  });
}
