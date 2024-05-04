import { backend } from '../backend';
import { ItemData, MerchantData } from '../types';

export async function getMerchants() {
  const response = await backend.get<MerchantData[]>('/merchants');
  return response.data;
}

export async function searchMerchant(query: string) {
  const response = await backend.get<MerchantData[]>('/merchants/search', {
    params: { q: query },
  });
  return response.data;
}
