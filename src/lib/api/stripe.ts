import { backend } from '../backend';
import { SubscriptionRecordData } from '../types';

interface CreateCheckoutSessionResult {
  redirect_url: string;
}
interface CreateCheckoutSessionParams {
  subscription_type: 'monthly' | 'yearly';
  success_url: string;
  cancel_url: string;
}
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
) {
  const response = await backend.post<CreateCheckoutSessionResult>(
    '/stripe/create-checkout-session',
    params
  );

  window.location.assign(response.data.redirect_url);
}
interface CreatePortalSessionResult {
  redirect_url: string;
}
interface CreatePortalSessionParams {
  return_url: string;
}
export async function createPortalSession(params: CreatePortalSessionParams) {
  const response = await backend.post<CreatePortalSessionResult>(
    '/stripe/create-portal-session',
    params
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
