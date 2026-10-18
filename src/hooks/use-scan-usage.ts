import { getScanUsage } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useScanUsage() {
  return useSWR('/receipts/usage', getScanUsage);
}
