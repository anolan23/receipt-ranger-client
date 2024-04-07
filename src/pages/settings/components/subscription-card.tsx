import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubscriptionRecordData } from '@/lib/types';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SubscriptionCardProps {
  subscription?: SubscriptionRecordData;
  loading?: boolean;
  onManageClick: () => void;
}

export function SubscriptionCard({
  subscription,
  loading,
  onManageClick,
  ...props
}: SubscriptionCardProps) {
  const hasSubscription = !!subscription;
  return (
    <Card className="w-full">
      <CardContent className="flex justify-between items-center p-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col">
              <div>{hasSubscription ? 'Pro member' : 'Basic member'}</div>
              {subscription?.subscription_status && (
                <div className="text-sm text-muted-foreground first-letter:uppercase">
                  {subscription.subscription_status}
                </div>
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
