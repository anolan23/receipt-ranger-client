import { backend } from '../backend';
import { CategoryData } from '../types';

export async function getCategories() {
  const response = await backend.get<CategoryData[]>('/categories');
  return response.data;
}
