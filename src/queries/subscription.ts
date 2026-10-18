import { queryKeys } from './keys';
import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionRecord,
} from '@/lib/api/stripe';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscription.current.queryKey,
    queryFn: getSubscriptionRecord,
  });
}

/** Both sessions redirect the browser to Stripe on success. */
export function useCreateCheckoutSession() {
  return useMutation({ mutationFn: createCheckoutSession });
}

export function useCreatePortalSession() {
  return useMutation({ mutationFn: createPortalSession });
}
