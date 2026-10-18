import { getCurrentUser } from '@/lib/api/auth';
import { useQuery } from '@tanstack/react-query';

export function useUserAttributes() {
  return useQuery({ queryKey: ['user-attributes'], queryFn: getCurrentUser });
}
