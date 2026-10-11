import { getCurrentUser } from '@/lib/api/auth';
import useSWR from 'swr';

export function useUserAttributes() {
  return useSWR('user-attributes', () => getCurrentUser());
}
