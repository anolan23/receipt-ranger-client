import { backend } from '../backend';
import { SubscriptionRecordData } from '../types';

interface CreateCheckoutSessionResult {
  redirect_url: string;
}
export async function createCheckoutSession(
  subscriptionType: 'monthly' | 'yearly'
) {
  const response = await backend.post<CreateCheckoutSessionResult>(
    '/stripe/create-checkout-session',
    { subscription_type: subscriptionType }
  );

  window.location.assign(response.data.redirect_url);
}
interface CreatePortalSessionResult {
  redirect_url: string;
}
export async function createPortalSession() {
  const response = await backend.post<CreatePortalSessionResult>(
    '/stripe/create-portal-session'
  );

  window.location.assign(response.data.redirect_url);
}

interface SubscriptionRecordResult {
  subscription?: SubscriptionRecordData;
}
export async function getSubscriptionRecord() {
  const response = await backend.get<SubscriptionRecordResult>(
    '/stripe/subscription'
  );

  return response.data;
}
