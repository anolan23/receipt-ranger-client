import { queryKeys } from './keys';
import { getCurrentUser } from '@/lib/api/auth';
import { useQuery } from '@tanstack/react-query';

export function useUserAttributes() {
  return useQuery({
    queryKey: queryKeys.user.attributes.queryKey,
    queryFn: getCurrentUser,
  });
}
