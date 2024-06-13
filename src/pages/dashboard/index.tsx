import { Cards } from '@/components/cards';
import { ImageLogo } from '@/components/image-logo';
import { MetricCard } from '@/components/metric-card';
import { ReceiptCard } from '@/components/receipt-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { useSubscription } from '@/hooks/use-subscription';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { toDollar } from '@/lib/helpers';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../../components/receipts-table';
import { ReceiptCardLink } from '@/components/receipt-card-link';
export function DashboardPage() {
  usePageTitle('Dashboard Home');
  const isMobile = useDeviceWidth();
  const {
    data: receipts,
    mutate: mutateReceipts,
    isLoading: isReceiptsLoading,
  } = useReceipts({ limit: 5 });
  const { rowSelection, setRowSelection, selectedRow, nextRow, prevRow } =
    useRowSelection({
      selectFirstOnMOunt: true,
      data: receipts,
    });
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    selectedRow?.id.toString()
  );

  const {
    data: spendingOverview,
    isLoading: isSpendingOverviewLoading,
    mutate: mutateSpendingOverview,
  } = useSpendingOverview();

  const { data: subscriptionRecord } = useSubscription();

  const calcPercentChange = (num1: number, num2: number) => {
    if (num2 === 0) return `+0% from last month`;
    const frac = (num1 - num2) / num2;
    const percent = Math.round(frac * 100);
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent}% from last month`;
  };

  const calcDifference = (num1: number, num2: number) => {
    const difference = num1 - num2;
    const sign = difference >= 0 ? 'more' : 'less';
    return `${toDollar(
      Math.abs(difference),
      'dollar'
    )} ${sign} than last month`;
  };

  const getPercentDiff = function (num1: number, num2: number) {
    return Math.min(Math.round((num1 / num2) * 100), 100);
  };

  const {
    current_month_spend,
    forecasted_spend,
    previous_month_spend,
    goal_budget,
  } = spendingOverview || {};

  const currentMonthDescription =
    current_month_spend && previous_month_spend
      ? calcDifference(+current_month_spend, +previous_month_spend)
      : undefined;

  const percentMonth = getPercentDiff(
    current_month_spend ? +current_month_spend : 0,
    goal_budget ? +goal_budget : 1000
  );
  const percentForcasted = getPercentDiff(
    forecasted_spend ? +forecasted_spend : 0,
    goal_budget ? +goal_budget : 1000
  );

  return (
    <DashboardLayout
      // breadcrumbs={
      //   <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-2xl">
      //     Dashboard
      //   </h1>
      // }
      content={
        <div className="space-y-4">
          <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>Receipts Overview</CardTitle>
                    <CardDescription className="text-sm max-w-lg text-balance leading-relaxed text-card-foreground">
                      Your Receipts Dashboard simplifies expense tracking and
                      organizes your receipts.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link to="/dashboard/scanner">Scan New Receipt</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <MetricCard
                  title="Current Month Total"
                  value={
                    current_month_spend
                      ? toDollar(current_month_spend, 'dollar')
                      : ''
                  }
                  description={currentMonthDescription}
                  percent={percentMonth}
                />
                <MetricCard
                  title="Forecasted Month Total"
                  value={
                    forecasted_spend ? toDollar(forecasted_spend, 'dollar') : ''
                  }
                  description={
                    forecasted_spend && previous_month_spend
                      ? calcDifference(+forecasted_spend, +previous_month_spend)
                      : undefined
                  }
                  percent={percentForcasted}
                />
              </div>
              <ReceiptsTable
                header={
                  <CardHeader>
                    <CardTitle>Receipts</CardTitle>
                    <CardDescription>
                      Recently scanned receipts.
                    </CardDescription>
                  </CardHeader>
                }
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                variant="embedded"
                selectionType="single"
                data={receipts || []}
                loading={isReceiptsLoading}
              />
              <Cards
                hidden={!isMobile}
                title="Recent Receipts"
                loading={isReceiptsLoading}
                loadingText="Loading Receipts"
                emptyText="No Receipts."
                data={receipts || []}
                renderCard={(receipt) => (
                  <ReceiptCardLink key={receipt.id} receipt={receipt} />
                )}
              />
              {!subscriptionRecord?.subscription && (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <Card className="sm:col-span-4">
                    <CardHeader>
                      <CardTitle>Upgrade to Pro</CardTitle>
                      <CardDescription>
                        Access to unlimited receipt scans and the latest
                        features.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild>
                        <Link to="/membership">Choose a plan</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            <div className="sticky top-4">
              <ReceiptCard
                hidden={isMobile}
                receipt={receipt}
                loading={isReceiptLoading}
                onPreviousClick={prevRow}
                onNextClick={nextRow}
                onDeleteSuccess={() => {
                  mutateReceipts();
                  mutateSpendingOverview();
                }}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
