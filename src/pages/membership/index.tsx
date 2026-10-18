import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceCard } from './components/price-card';
import { createCheckoutSession, createPortalSession } from '@/lib/api/stripe';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { Logo } from '@/components/logo';
import { usePageTitle } from '@/hooks/use-page-title';

interface MembershipPageProps {}

export function MembershipPage({ ...props }: MembershipPageProps) {
  usePageTitle('Membership');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  const ensureAuth = function () {
    if (isAuthenticated === false) navigate('/signup');
  };

  const handleMonthlyClick: React.MouseEventHandler<HTMLButtonElement> =
    async function (e) {
      try {
        ensureAuth();
        setLoading(true);
        await createCheckoutSession({
          subscription_type: 'monthly',
          success_url: `${
            import.meta.env.VITE_APP_URL
          }/dashboard/settings/subscription`,
          cancel_url: `${
            import.meta.env.VITE_APP_URL
          }/dashboard/settings/subscription`,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  const handleYearlyClick: React.MouseEventHandler<HTMLButtonElement> =
    async function (e) {
      try {
        ensureAuth();
        setLoading(true);
        await createCheckoutSession({
          subscription_type: 'yearly',
          success_url: `${
            import.meta.env.VITE_APP_URL
          }/dashboard/settings/subscription`,
          cancel_url: `${
            import.meta.env.VITE_APP_URL
          }/dashboard/settings/subscription`,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
          <Tabs defaultValue="yearly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (save 50%)</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <PriceCard
                title="Receipt Ranger Pro"
                description="Scan as many receipts as you like and get the latest features first."
                price="4.99"
                interval="monthly"
                onClick={handleMonthlyClick}
              />
            </TabsContent>
            <TabsContent value="yearly">
              <PriceCard
                badge="Best deal"
                title="Receipt Ranger Pro"
                description="Scan as many receipts as you like and get the latest features first."
                price="3.33"
                interval="yearly"
                footer="*when billed yearly"
                onClick={handleYearlyClick}
              />
            </TabsContent>
          </Tabs>
          <p className="w-full text-center text-ink-muted sm:w-[50%]">
            Both plans include <strong>unlimited receipt scans</strong>. By
            choosing the yearly plan, you save 50% compared to paying monthly.
          </p>
        </div>
      </main>
    </div>
    </div>
  );
}
