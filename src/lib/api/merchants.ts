import { supabase } from '../supabase';
import { MerchantData } from '../types';

export async function getMerchants() {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return data as MerchantData[];
}

export async function searchMerchant(query: string) {
  const escaped = query.replace(/[\\%_]/g, '\\$&');
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .ilike('name', `%${escaped}%`)
    .limit(5);
  if (error) throw new Error(error.message);
  return data as MerchantData[];
}
