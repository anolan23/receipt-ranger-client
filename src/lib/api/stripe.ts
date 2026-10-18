import { supabase } from '../supabase';
import { SubscriptionRecordData } from '../types';

// Checkout and the billing portal need Stripe Edge Functions, which the Supabase
// backend doesn't have yet.
const NOT_AVAILABLE = 'Subscriptions are not available yet.';

interface CreateCheckoutSessionParams {
  subscription_type: 'monthly' | 'yearly';
  success_url: string;
  cancel_url: string;
}
export async function createCheckoutSession(
  _params: CreateCheckoutSessionParams
): Promise<void> {
  throw new Error(NOT_AVAILABLE);
}

interface CreatePortalSessionParams {
  return_url: string;
}
export async function createPortalSession(
  _params: CreatePortalSessionParams
): Promise<void> {
  throw new Error(NOT_AVAILABLE);
}

interface SubscriptionRecordResult {
  subscription?: SubscriptionRecordData;
}
export async function getSubscriptionRecord(): Promise<SubscriptionRecordResult> {
  const { data, error } = await supabase
    .from('subscription_records')
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { subscription: (data as SubscriptionRecordData | null) ?? undefined };
}
