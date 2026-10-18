import { fetchAllPages, supabase } from '../supabase';
import { CategoryData, ItemData, SubcategoryData } from '../types';
import { toItem } from './mappers';

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as CategoryData[];
}

export async function getCategory(categoryId: number | string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', Number(categoryId))
    .single();
  if (error) throw new Error(error.message);
  return data as CategoryData;
}

/** Items on the user's receipts whose subcategory belongs to the category. */
export async function getCategoryItems(categoryId: number | string) {
  const rows = await fetchAllPages((from, to) =>
    supabase
      .from('items')
      .select('*, subcategory:subcategories!inner(name, category_id)')
      .eq('subcategory.category_id', Number(categoryId))
      .range(from, to)
  );
  return rows.map((row) => toItem(row as never)) as ItemData[];
}

export async function getSubcategories(categoryId: number | string) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', Number(categoryId))
    .order('id');
  if (error) throw new Error(error.message);
  return data as unknown as SubcategoryData[];
}
