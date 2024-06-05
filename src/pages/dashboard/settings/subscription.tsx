import { useSubscription } from '@/hooks/use-subscription';
import { SettingsLayout } from '@/layout/settings-layout';
import { createPortalSession } from '@/lib/api/stripe';
import { useState } from 'react';
import { SubscriptionCard } from './components/subscription-card';

interface SubscriptionSettingsProps {}

export function SubscriptionSettings({ ...props }: SubscriptionSettingsProps) {
  const { data: subscriptionResult, isLoading: isSubscriptionLoading } =
    useSubscription();
  const [loading, setLoading] = useState(false);

  const handleManageClick = async function () {
    try {
      setLoading(true);
      await createPortalSession({
        return_url: `${
          import.meta.env.VITE_APP_URL
        }/dashboard/settings/subscription`,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hasSubscription = !!subscriptionResult?.subscription;
  return (
    <SettingsLayout
      title="Subscription"
      description="Here, you have full control over your subscription plan and preferences. Review your current plan details, update your billing information"
      form={
        <div className="flex flex-col space-y-4 items-start">
          <SubscriptionCard
            subscription={subscriptionResult?.subscription}
            onManageClick={handleManageClick}
            loading={isSubscriptionLoading}
          />
        </div>
      }
    />
  );
}
