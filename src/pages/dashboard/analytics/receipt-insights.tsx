import { MetricCard } from '@/components/metric-card';
import { useCategoryTotals } from '@/hooks/use-category-totals';
import { useDateRangePresetOutletContext } from '@/hooks/use-date-range-preset';
import { useMerchantCounts } from '@/hooks/use-merchant-counts';
import { useMonthlyTotals } from '@/hooks/use-monthly-totals';

import { useOverview } from '@/hooks/use-overview';
import { usePageTitle } from '@/hooks/use-page-title';
import { toDollar } from '@/lib/helpers';
import { CategoriesCard } from './components/categories-card';
import { MerchantsCard } from './components/merchants-card';
import { MonthlyTotalsCard } from './components/monthly-totals-card';

interface ReceiptInsightsPageProps {}

export function ReceiptInsightsPage({ ...props }: ReceiptInsightsPageProps) {
  usePageTitle('Receipt Insights');
  const { datePreset, dateRange, dateInterval } =
    useDateRangePresetOutletContext();

  const { data: overviewData, isLoading: isOverviewLoading } =
    useOverview(dateInterval);

  const { data: monthlyTotalsData, isLoading: monthlyTotalsDataLoading } =
    useMonthlyTotals(dateInterval);

  const { data: categoryTotalsResult, isLoading: isCategoryTotalsLoading } =
    useCategoryTotals(dateInterval);

  const { data: merchantCounts } = useMerchantCounts(dateInterval);

  return (
    <div className="grid gap-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total spent"
          value={
            overviewData?.total_amount
              ? toDollar(overviewData.total_amount)
              : '$0'
          }
          loading={isOverviewLoading}
        />
        <MetricCard
          title="Average per receipt"
          value={
            overviewData?.avg_receipt_total
              ? toDollar(overviewData.avg_receipt_total)
              : '$0'
          }
          loading={isOverviewLoading}
        />
        <MetricCard
          title="Receipts scanned"
          value={overviewData?.receipt_count ? overviewData.receipt_count : '0'}
          loading={isOverviewLoading}
        />
      </div>
      <div className="min-w-0">
        <MonthlyTotalsCard
          data={monthlyTotalsData}
          loading={monthlyTotalsDataLoading}
          dateRange={dateRange}
          datePreset={datePreset}
        />
      </div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <CategoriesCard
          data={categoryTotalsResult || []}
          loading={isCategoryTotalsLoading}
        />
        <MerchantsCard data={merchantCounts || []} />
      </div>
    </div>
  );
}
