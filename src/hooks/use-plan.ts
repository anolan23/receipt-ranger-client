import { getPlan } from '@/lib/plan';
import { useSubscription } from '@/queries/subscription';

/** The user's plan, derived from their subscription record. Read this instead of checking the record directly. */
export function usePlan() {
  const { data, isLoading, error, refetch } = useSubscription();
  const subscription = data?.subscription;
  return {
    ...getPlan(subscription),
    subscription,
    isLoading,
    error,
    refetch,
  };
}
