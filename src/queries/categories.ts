import {
  getCategories,
  getCategory,
  getCategoryItems,
  getSubcategories,
} from '@/lib/api/categories';
import { useQuery } from '@tanstack/react-query';

type CategoryId = number | string;

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id?: CategoryId | null) => ['categories', id] as const,
  items: (id?: CategoryId | null) => ['categories', id, 'items'] as const,
  subcategories: (id?: CategoryId | null) =>
    ['categories', id, 'subcategories'] as const,
};

export function useCategories() {
  return useQuery({ queryKey: categoryKeys.all, queryFn: getCategories });
}

export function useCategory(categoryId?: CategoryId) {
  return useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => getCategory(categoryId!),
    enabled: !!categoryId,
  });
}

export function useCategoryItems(categoryId?: CategoryId) {
  return useQuery({
    queryKey: categoryKeys.items(categoryId),
    queryFn: () => getCategoryItems(categoryId!),
    enabled: !!categoryId,
  });
}

export function useSubcategories(categoryId?: CategoryId | null) {
  return useQuery({
    queryKey: categoryKeys.subcategories(categoryId),
    queryFn: () => getSubcategories(categoryId!),
    enabled: !!categoryId,
  });
}
