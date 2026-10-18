import { invokeFunction, supabase } from '../supabase';
import { SubscriptionRecordData } from '../types';

type RedirectResult = { redirect_url: string };

interface CreateCheckoutSessionParams {
  subscription_type: 'monthly' | 'yearly';
  success_url: string;
  cancel_url: string;
}
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
) {
  const result = await invokeFunction<RedirectResult>('stripe-checkout', params);
  window.location.assign(result.redirect_url);
}

interface CreatePortalSessionParams {
  return_url: string;
}
export async function createPortalSession(params: CreatePortalSessionParams) {
  const result = await invokeFunction<RedirectResult>('stripe-portal', params);
  window.location.assign(result.redirect_url);
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
