import { Cards } from '@/components/cards';
import { MerchantBars } from '@/components/charts/merchant-bars';
import { PieSeries } from '@/components/charts/interfaces';
import { NivoPieChart } from '@/components/charts/nivo-pie-chart';
import { Header } from '@/components/header';
import { MetricCard, MetricTrend } from '@/components/metric-card';
import { ReceiptCardLink } from '@/components/receipt-card-link';
import { ReceiptSheet } from '@/components/receipt-sheet';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCategoryTotals } from '@/hooks/use-category-totals';
import { useDateRangePreset } from '@/hooks/use-date-range-preset';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { useMerchantCounts } from '@/hooks/use-merchant-counts';
import { useMonthlyTotals } from '@/hooks/use-monthly-totals';
import { useOverview } from '@/hooks/use-overview';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { UsageMeter } from '@/components/usage-meter';
import { usePlan } from '@/hooks/use-plan';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { getCategoryStyle } from '@/lib/categories';
import { toDollar } from '@/lib/helpers';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../../components/receipts-table';
import { MonthlyTotalsCard } from './analytics/components/monthly-totals-card';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage() {
  usePageTitle('Overview');
  const isMobile = useDeviceWidth();
  const {
    data: receipts,
    mutate: mutateReceipts,
    isLoading: isReceiptsLoading,
  } = useReceipts({ limit: 5 });
  const { rowSelection, setRowSelection, selectedRow, nextRow, prevRow } =
    useRowSelection({
      selectFirstOnMOunt: false,
      data: receipts,
    });
  const { data: receipt } = useReceipt(selectedRow?.id.toString());

  const {
    data: spendingOverview,
    isLoading: isSpendingOverviewLoading,
    mutate: mutateSpendingOverview,
  } = useSpendingOverview();

  const { tier: planTier, isLoading: isPlanLoading } = usePlan();

  const { datePreset, setDatePreset, dateRange, dateInterval } =
    useDateRangePreset('6-months');
  const { data: monthlyTotals, isLoading: isMonthlyTotalsLoading } =
    useMonthlyTotals(dateInterval);

  // This month so far, for the KPI cards, donut and merchants.
  const { dateInterval: monthInterval } = useDateRangePreset('mtd');
  const { data: monthOverview, isLoading: isMonthOverviewLoading } =
    useOverview(monthInterval);
  const { data: categoryTotals, isLoading: isCategoryTotalsLoading } =
    useCategoryTotals(monthInterval);
  const { data: merchantCounts } = useMerchantCounts(monthInterval);

  const { current_month_spend, forecasted_spend, previous_month_spend, goal_budget } =
    spendingOverview || {};

  const current = current_month_spend ? +current_month_spend : 0;
  const previous = previous_month_spend ? +previous_month_spend : 0;

  const goal = goal_budget ? +goal_budget : undefined;
  const percentOfGoal = goal
    ? Math.min(Math.round((current / goal) * 100), 100)
    : undefined;

  // Frame spending as progress: less is a win, more is a gentle amber heads-up.
  const change = useMemo<{ value: string; trend?: MetricTrend }>(() => {
    if (!previous) return { value: '--' };
    const percent = Math.round(((current - previous) / previous) * 100);
    const difference = toDollar(Math.abs(current - previous), 'dollar');
    if (current <= previous)
      return {
        value: `${Math.abs(percent)}%`,
        trend: { tone: 'win', text: `${difference} less than last month` },
      };
    return {
      value: `${percent}%`,
      trend: { tone: 'rise', text: `${difference} more than last month` },
    };
  }, [current, previous]);

  const topCategory = useMemo(() => {
    if (!categoryTotals?.length) return undefined;
    return [...categoryTotals].sort((a, b) => +b.total - +a.total)[0];
  }, [categoryTotals]);
  const topCategoryStyle = getCategoryStyle(topCategory?.category);

  const categorySeries = useMemo<PieSeries<number>[]>(
    () =>
      (categoryTotals || []).map((dataPoint) => ({
        type: 'pie',
        title: dataPoint.category,
        data: {
          id: dataPoint.category,
          label: dataPoint.category,
          value: +dataPoint.total,
        },
      })),
    [categoryTotals]
  );

  const merchantRows = useMemo(
    () =>
      (merchantCounts || []).map((row) => ({
        name: row.merchant,
        count: row.count,
      })),
    [merchantCounts]
  );

  const month = dayjs().format('MMMM');

  return (
    <DashboardLayout
      content={
        <div className="grid gap-4">
          <Header
            title={`${greeting()}! Here's how ${month} is going`}
            description="A quick look at where your money went."
            actions={
              <Button asChild className="hidden md:inline-flex">
                <Link to="/dashboard/scan">Scan a receipt</Link>
              </Button>
            }
          />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <MetricCard
              hero
              className="col-span-2"
              title="Spent this month"
              value={current_month_spend ? toDollar(current, 'dollar') : '$0'}
              loading={isSpendingOverviewLoading}
              percent={percentOfGoal}
              description={
                goal
                  ? `${percentOfGoal}% of your ${toDollar(goal, 'dollar')} goal${
                      forecasted_spend
                        ? ` · on track for ${toDollar(+forecasted_spend, 'dollar')}`
                        : ''
                    }`
                  : forecasted_spend
                  ? `On track for about ${toDollar(+forecasted_spend, 'dollar')} by month end`
                  : undefined
              }
            />
            <MetricCard
              title="Change vs. last month"
              value={change.value}
              trend={change.trend}
              loading={isSpendingOverviewLoading}
              description={
                change.trend ? undefined : 'Scan a few more and I can compare.'
              }
            />
            <MetricCard
              title="Receipts scanned"
              value={monthOverview?.receipt_count ?? 0}
              loading={isMonthOverviewLoading}
              description="This month so far"
            />
            <MetricCard
              title="Top category"
              value={
                topCategory
                  ? `${topCategoryStyle.emoji} ${topCategory.category}`
                  : '--'
              }
              loading={isCategoryTotalsLoading}
              description={
                topCategory
                  ? toDollar(+topCategory.total, 'dollar')
                  : 'Nothing scanned yet'
              }
            />
            <MetricCard
              className="col-span-2 md:col-span-1"
              title="Average per receipt"
              value={
                monthOverview?.avg_receipt_total
                  ? toDollar(monthOverview.avg_receipt_total)
                  : '$0'
              }
              loading={isMonthOverviewLoading}
              description="This month so far"
            />
          </div>

          <div className="grid min-w-0 gap-4 lg:grid-cols-[1.45fr_1fr]">
            <div className="grid min-w-0 content-start gap-4">
              <MonthlyTotalsCard
                data={monthlyTotals}
                loading={isMonthlyTotalsLoading}
                dateRange={dateRange}
                datePreset={datePreset}
                onDatePresetChange={setDatePreset}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Your top stores</CardTitle>
                  <CardDescription>
                    Where you shopped most this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MerchantBars data={merchantRows} />
                </CardContent>
              </Card>
            </div>
            <Card className="content-start">
              <CardHeader>
                <CardTitle>Where it went</CardTitle>
                <CardDescription>Your categories this month</CardDescription>
              </CardHeader>
              <CardContent>
                <NivoPieChart
                  series={categorySeries}
                  loading={isCategoryTotalsLoading}
                  categoryColors
                  centerLabel="Spent"
                  formatValue={(value) => toDollar(value, 'dollar')}
                />
              </CardContent>
            </Card>
          </div>

          <div className="min-w-0">
            <ReceiptsTable
              header={
                <CardHeader>
                  <CardTitle>Recent receipts</CardTitle>
                  <CardDescription>The last few I read for you</CardDescription>
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
              title="Recent receipts"
              loading={isReceiptsLoading}
              loadingText="Counting the coupons…"
              emptyText="No receipts yet. Let's scan your first one!"
              data={receipts || []}
              renderCard={(receipt) => (
                <ReceiptCardLink key={receipt.id} receipt={receipt} />
              )}
            />
          </div>

          {!isPlanLoading && planTier === 'free' && (
            <Card className="flex-col items-start gap-3 bg-blob-lavender sm:flex-row sm:items-center">
              <div className="grid flex-1 gap-0.5">
                <div className="type-h3">Upgrade to Pro</div>
                <p className="text-sm">
                  Scan as many receipts as you like, with no monthly limit.
                </p>
                <UsageMeter />
              </div>
              <Button asChild variant="secondary">
                <Link to="/membership">Choose a plan</Link>
              </Button>
            </Card>
          )}

          <ReceiptSheet
            open={!isMobile && !!selectedRow}
            receipt={receipt}
            onClose={() => setRowSelection({})}
            onPreviousClick={prevRow}
            onNextClick={nextRow}
            onDeleteSuccess={() => {
              setRowSelection({});
              mutateReceipts();
              mutateSpendingOverview();
            }}
          />
        </div>
      }
    />
  );
}

