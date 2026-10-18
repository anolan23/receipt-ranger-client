import { getSubscriptionRecord } from '@/lib/api/stripe';
import { useQuery } from '@tanstack/react-query';

export function useSubscription() {
  return useQuery({
    queryKey: ['stripe', 'subscription'],
    queryFn: getSubscriptionRecord,
  });
}
