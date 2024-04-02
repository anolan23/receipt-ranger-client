import { fetchUserAttributes } from 'aws-amplify/auth';
import useSWR from 'swr';

export function useUserAttributes() {
  return useSWR('user-attributes', () => fetchUserAttributes());
}
