import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlanState, PlanTier } from '@/lib/plan';
import { SubscriptionRecordData } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

interface SubscriptionCardProps {
  subscription?: SubscriptionRecordData;
  tier: PlanTier;
  state: PlanState;
  loading?: boolean;
  onManageClick: () => void;
}

export function SubscriptionCard({
  subscription,
  tier,
  state,
  loading,
  onManageClick,
  ...props
}: SubscriptionCardProps) {
  const hasSubscription = !!subscription;
  const detail: Partial<Record<PlanState, string>> = {
    trialing: 'Trial',
    past_due: 'Payment failed. Update your payment method to keep Pro.',
    canceled:
      tier === 'pro'
        ? `Ends ${new Date(subscription?.end_date ?? '').toLocaleDateString()}`
        : 'Canceled',
    action_needed: 'Your subscription is not active. Finish payment to turn Pro back on.',
  };
  return (
    <Card className="w-full">
      <CardContent className="flex justify-between items-center p-6 gap-2">
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <div className="flex flex-col">
              <div>{tier === 'pro' ? 'Pro member' : 'Free plan'}</div>
              {detail[state] && (
                <div className="text-sm text-ink-muted">{detail[state]}</div>
              )}
            </div>
            {hasSubscription ? (
              <Button onClick={onManageClick}>
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Manage Subscription
              </Button>
            ) : (
              <Button asChild>
                <Link to={{ pathname: '/membership', search: 'c=settings' }}>
                  Subscription plans
                </Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
