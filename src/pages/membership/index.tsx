import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceCard } from './components/price-card';
import { createCheckoutSession } from '@/lib/api/stripe';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/logo';
import { usePageTitle } from '@/hooks/use-page-title';

interface MembershipPageProps {}

export function MembershipPage({ ...props }: MembershipPageProps) {
  usePageTitle('Membership');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(
    null
  );
  const [error, setError] = useState<string>();
  const { isAuthenticated } = useUser();

  const startCheckout = async (plan: 'monthly' | 'yearly') => {
    if (isAuthenticated === false) {
      navigate('/signup');
      return;
    }
    const appUrl = import.meta.env.VITE_APP_URL;
    setError(undefined);
    setLoadingPlan(plan);
    try {
      await createCheckoutSession({
        subscription_type: plan,
        success_url: `${appUrl}/dashboard/settings/subscription?checkout=success`,
        cancel_url: `${appUrl}/membership?checkout=canceled${
          searchParams.get('c') ? `&c=${searchParams.get('c')}` : ''
        }`,
      });
    } catch (e) {
      console.error(e);
      setError("We couldn't open checkout. Nothing was charged. Try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-dvh bg-surface-100 text-ink">
    <div className="m-auto max-w-[1200px]">
      <header className="p-5 sm:p-6 flex flex-col items-center space-y-8 sm:space-y-10">
        <nav className="flex justify-between items-center w-full">
          <div className="flex space-x-1 items-center">
            <Logo />
          </div>
          <div>
            <Button variant="ghost" asChild>
              <Link
                to={
                  searchParams.get('c') === 'settings'
                    ? '/dashboard/settings/subscription'
                    : searchParams.get('c') === 'scan'
                    ? '/dashboard/scan'
                    : '/dashboard'
                }
              >
                <ArrowLeft aria-hidden />
                Back
              </Link>
            </Button>
          </div>
        </nav>
        <h1 className="type-h1 text-center lg:text-[44px] lg:leading-[48px]">
          Choose a Receipt Ranger Pro plan
        </h1>
      </header>
      <main className="mb-10">
        <div className="flex flex-col items-center space-y-4 mx-4">
          {searchParams.get('checkout') === 'canceled' && (
            <Alert variant="default" role="status" className="max-w-sm">
              <Info aria-hidden />
              <AlertDescription>
                No worries, you weren't charged. Pick a plan whenever you're
                ready.
              </AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="yearly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (save 33%)</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <PriceCard
                title="Receipt Ranger Pro"
                description="Scan as many receipts as you like."
                price="4.99"
                interval="monthly"
                billedAmount="4.99"
                loading={loadingPlan === 'monthly'}
                disabled={loadingPlan !== null}
                error={error}
                onClick={() => startCheckout('monthly')}
              />
            </TabsContent>
            <TabsContent value="yearly">
              <PriceCard
                badge="Best deal"
                title="Receipt Ranger Pro"
                description="Scan as many receipts as you like."
                price="3.33"
                interval="yearly"
                billedAmount="39.99"
                loading={loadingPlan === 'yearly'}
                disabled={loadingPlan !== null}
                error={error}
                onClick={() => startCheckout('yearly')}
              />
            </TabsContent>
          </Tabs>
          <p className="w-full text-center text-ink-muted sm:w-[50%]">
            Free gives you a monthly scan limit. Pro removes it. Yearly costs
            about 33% less than paying monthly.
          </p>
        </div>
      </main>
    </div>
    </div>
  );
}
