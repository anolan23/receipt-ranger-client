import { CategoryId, queryKeys } from './keys';
import {
  getCategories,
  getCategory,
  getCategoryItems,
  getSubcategories,
} from '@/lib/api/categories';
import { skipToken, useQuery } from '@tanstack/react-query';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list.queryKey,
    queryFn: getCategories,
  });
}

export function useCategory(categoryId?: CategoryId) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId).queryKey,
    queryFn: categoryId ? () => getCategory(categoryId) : skipToken,
  });
}

export function useCategoryItems(categoryId?: CategoryId) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId)._ctx.items.queryKey,
    queryFn: categoryId ? () => getCategoryItems(categoryId) : skipToken,
  });
}

export function useSubcategories(categoryId?: CategoryId | null) {
  const id = categoryId ?? undefined;
  return useQuery({
    queryKey: queryKeys.categories.detail(id)._ctx.subcategories.queryKey,
    queryFn: id ? () => getSubcategories(id) : skipToken,
  });
}
