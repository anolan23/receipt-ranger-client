import { backend } from '../backend';
import { CategoryData, ItemData, SubcategoryData } from '../types';

export async function getCategories() {
  const response = await backend.get<CategoryData[]>('/categories');
  return response.data;
}

export async function getCategory(categoryId: number | string) {
  const response = await backend.get<CategoryData>(`/categories/${categoryId}`);
  return response.data;
}

export async function getCategoryItems(categoryId: number | string) {
  const response = await backend.get<ItemData[]>(
    `/categories/${categoryId}/items`
  );
  return response.data;
}

export async function getSubcategories(categoryId: number | string) {
  const response = await backend.get<SubcategoryData[]>(
    `/categories/${categoryId}/subcategories`
  );
  return response.data;
}
