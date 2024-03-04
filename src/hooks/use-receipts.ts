import { getReceipts } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceipts() {
  return useSWR('/receipts', getReceipts);
}
