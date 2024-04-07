import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PriceCard } from './components/price-card';
import { createCheckoutSession, createPortalSession } from '@/lib/api/stripe';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import Logo from '@/assets/logo.svg?react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';

interface MembershipPageProps {}

export function MembershipPage({ ...props }: MembershipPageProps) {
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
      <header className="p-6 flex flex-col items-center space-y-2">
        <nav className="flex justify-between items-center w-full">
          <div className="flex space-x-2 items-center">
            <Logo fill="hsl(var(--foreground))" />
            <span className="font-semibold text-xl">ReceiptMind</span>
          </div>
          <div>
            <Button variant="link" asChild>
              <Link
                to={
                  searchParams.get('c') === 'settings'
                    ? '/settings/subscription'
                    : '/dashboard'
                }
              >
                <ArrowLeftIcon className="mr-2" />
                Back
              </Link>
            </Button>
          </div>
        </nav>
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl text-center">
          Choose a plan for after your 7-day free trial
        </h1>
      </header>
      <main>
        <div className="flex flex-col items-center space-y-4">
          <Tabs defaultValue="yearly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (save 50%)</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <PriceCard
                title="ReceiptMind Pro"
                description="Simplify your expense tracking. Enjoy unlimited receipt scans and access to the latest features."
                price="4.99"
                interval="monthly"
                onClick={handleMonthlyClick}
              />
            </TabsContent>
            <TabsContent value="yearly">
              <PriceCard
                badge="Best deal"
                title="ReceiptMind Pro"
                description="Simplify your expense tracking. Enjoy unlimited receipt scans and access to the latest features."
                price="3.33"
                interval="yearly"
                footer="*when billed yearly"
                onClick={handleYearlyClick}
              />
            </TabsContent>
          </Tabs>
          <p className=" text-muted-foreground text-center w-[50%]">
            Both plans include <strong>unlimited receipt</strong> scans. By
            choosing the yearly plan, you save 50% compared to paying monthly.
          </p>
        </div>
      </main>
    </div>
  );
}
