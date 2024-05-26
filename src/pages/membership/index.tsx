import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceCard } from './components/price-card';
import { createCheckoutSession, createPortalSession } from '@/lib/api/stripe';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { ScanLogo } from '@/components/scan-logo';
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
    if (!isAuthenticated) navigate('/signup');
  };

  const handleMonthlyClick: React.MouseEventHandler<HTMLButtonElement> =
    async function (e) {
      try {
        ensureAuth();
        setLoading(true);
        await createCheckoutSession('monthly');
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
        await createCheckoutSession('yearly');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className=" max-w-[1200px] m-auto">
      <header className="p-5 sm:p-6 flex flex-col items-center space-y-8 sm:space-y-10">
        <nav className="flex justify-between items-center w-full">
          <div className="flex space-x-1 items-center">
            <Logo />
          </div>
          <div>
            <Button variant="link" asChild>
              <Link
                to={
                  searchParams.get('c') === 'settings'
                    ? '/dashboard/settings/subscription'
                    : '/dashboard'
                }
              >
                <ArrowLeftIcon className="mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </nav>
        <h1 className="scroll-m-20 text-2xl sm:text-3xl font-extrabold tracking-tight lg:text-4xl text-center">
          Choose a plan for after your 7-day free trial
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
                title="Snapceipt Pro"
                description="Simplify your expense tracking. Enjoy unlimited receipt scans and access to the latest features."
                price="4.99"
                interval="monthly"
                onClick={handleMonthlyClick}
              />
            </TabsContent>
            <TabsContent value="yearly">
              <PriceCard
                badge="Best deal"
                title="Snapceipt Pro"
                description="Simplify your expense tracking. Enjoy unlimited receipt scans and access to the latest features."
                price="3.33"
                interval="yearly"
                footer="*when billed yearly"
                onClick={handleYearlyClick}
              />
            </TabsContent>
          </Tabs>
          <p className=" text-muted-foreground text-center w-full sm:w-[50%]">
            Both plans include <strong>unlimited receipt scans</strong>. By
            choosing the yearly plan, you save 50% compared to paying monthly.
          </p>
        </div>
      </main>
    </div>
  );
}
