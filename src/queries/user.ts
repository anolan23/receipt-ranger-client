import { getCurrentUser } from '@/lib/api/auth';
import { useQuery } from '@tanstack/react-query';

export const userKeys = {
  attributes: ['user-attributes'] as const,
};

export function useUserAttributes() {
  return useQuery({
    queryKey: userKeys.attributes,
    queryFn: getCurrentUser,
  });
}
