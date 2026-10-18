import { usePlan } from '@/hooks/use-plan';
import { SettingsLayout } from '@/layout/settings-layout';
import { useCreatePortalSession } from '@/queries/subscription';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UsageMeter } from '@/components/usage-meter';
import { CircleCheck, Info } from 'lucide-react';
import { SubscriptionCard } from './components/subscription-card';

interface SubscriptionSettingsProps {}

export function SubscriptionSettings({ ...props }: SubscriptionSettingsProps) {
  const {
    subscription,
    tier,
    state,
    isLoading: isSubscriptionLoading,
    refetch,
  } = usePlan();
  const [searchParams, setSearchParams] = useSearchParams();
  // Remember a checkout return, then drop the param so a refresh doesn't replay it.
  const [returnedFromCheckout] = useState(
    () => searchParams.get('checkout') === 'success'
  );
  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    if (searchParams.has('checkout')) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // The Stripe webhook can lag behind the redirect, so poll briefly.
  const waiting = returnedFromCheckout && tier !== 'pro' && !gaveUp;
  useEffect(() => {
    if (!waiting) return;
    const poll = setInterval(() => refetch(), 2000);
    const stop = setTimeout(() => setGaveUp(true), 20000);
    return () => {
      clearInterval(poll);
      clearTimeout(stop);
    };
  }, [waiting, refetch]);
  const createPortalSession = useCreatePortalSession();

  const handleManageClick = function () {
    createPortalSession.mutate(
      {
        return_url: `${
          import.meta.env.VITE_APP_URL
        }/dashboard/settings/subscription`,
      },
      { onError: (error) => console.error(error) }
    );
  };

  return (
    <SettingsLayout
      title="Subscription"
      description="Here, you have full control over your subscription plan and preferences. Review your current plan details, update your billing information."
      form={
        <div className="flex flex-col space-y-4 items-start">
          {returnedFromCheckout && tier === 'pro' && (
            <Alert variant="win" role="status">
              <CircleCheck aria-hidden />
              <AlertDescription>
                You're on Pro. Thank you! Unlimited scans are on.
              </AlertDescription>
            </Alert>
          )}
          {waiting && (
            <Alert variant="default" role="status">
              <Info aria-hidden />
              <AlertDescription>Confirming your payment…</AlertDescription>
            </Alert>
          )}
          {returnedFromCheckout && tier !== 'pro' && gaveUp && (
            <Alert variant="rise" role="status">
              <Info aria-hidden />
              <AlertDescription>
                Payment received, but it's taking a moment to show up. Refresh
                in a minute.
              </AlertDescription>
            </Alert>
          )}
          <SubscriptionCard
            subscription={subscription}
            tier={tier}
            state={state}
            onManageClick={handleManageClick}
            loading={isSubscriptionLoading}
          />
          <div className="w-full">
            <UsageMeter from="settings" />
          </div>
        </div>
      }
    />
  );
}
