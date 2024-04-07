import { getSubscriptionRecord } from '@/lib/api/stripe';
import useSWR from 'swr';

export function useSubscription() {
  return useSWR('/stripe/subscription', getSubscriptionRecord);
}
