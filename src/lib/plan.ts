import { SubscriptionRecordData, SubscriptionStatus } from './types';

export type PlanTier = 'free' | 'pro';
export type PlanState =
  | 'none'
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'action_needed';

/**
 * Maps a Stripe subscription record to what the UI should show.
 * active, trialing and past_due keep Pro (Stripe retries payment, so access
 * continues). canceled stays Pro until end_date. Everything else is free.
 */
export function getPlan(subscription?: SubscriptionRecordData): {
  tier: PlanTier;
  state: PlanState;
} {
  if (!subscription) return { tier: 'free', state: 'none' };
  const status: SubscriptionStatus = subscription.subscription_status;
  switch (status) {
    case 'active':
    case 'trialing':
    case 'past_due':
      return { tier: 'pro', state: status };
    case 'canceled': {
      const endsAt = Date.parse(subscription.end_date);
      const stillActive = !Number.isNaN(endsAt) && endsAt > Date.now();
      return { tier: stillActive ? 'pro' : 'free', state: 'canceled' };
    }
    default:
      return { tier: 'free', state: 'action_needed' };
  }
}
