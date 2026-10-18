import { getCategory } from '@/lib/api/categories';
import { useQuery } from '@tanstack/react-query';

export function useCategory(categoryId?: number | string) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => getCategory(categoryId!),
    enabled: !!categoryId,
  });
}
