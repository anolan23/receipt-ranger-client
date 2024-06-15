import { getTopBaseItems } from '@/lib/api/analytics';
import { UseTopBaseItemsParams } from '@/lib/types';
import useSWR from 'swr';

export function useTopBaseItems(params?: UseTopBaseItemsParams) {
  const queryString = new URLSearchParams(params as any).toString();
  const key = `/analytics/top-base-items?${queryString}`;
  return useSWR(key, () => getTopBaseItems(params));
}
