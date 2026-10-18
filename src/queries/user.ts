import { queryKeys } from './keys';
import { getCurrentUser, login, register } from '@/lib/api/auth';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useUserAttributes() {
  return useQuery({
    queryKey: queryKeys.user.attributes.queryKey,
    queryFn: getCurrentUser,
  });
}

export function useLogin() {
  return useMutation({ mutationFn: login });
}

export function useRegister() {
  return useMutation({ mutationFn: register });
}
