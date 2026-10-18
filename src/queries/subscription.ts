import {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionRecord,
} from '@/lib/api/stripe';
import { useMutation, useQuery } from '@tanstack/react-query';

export const subscriptionKeys = {
  all: ['stripe', 'subscription'] as const,
};

export function useSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.all,
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
