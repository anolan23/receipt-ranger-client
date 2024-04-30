import { DateRangePickerPreset } from '@/components/date-range-picker-preset';
import { MetricCard } from '@/components/metric-card';
import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategoryTotals } from '@/hooks/use-category-totals';
import { useDateRangePreset } from '@/hooks/use-date-range-preset';
import { useMerchantCounts } from '@/hooks/use-merchant-counts';
import { useMonthlyTotals } from '@/hooks/use-monthly-totals';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { CategoriesCard } from './components/categories-card';
import { MerchantsCard } from './components/merchants-card';
import { MonthlyTotalsCard } from './components/monthly-totals-card';
import { useOverview } from '@/hooks/use-overview';

interface AnalyticsProps {}

export function AnalyticsPage({ ...props }: AnalyticsProps) {
  const { datePreset, dateRange, dateRangeStr, setDatePreset, setDateRange } =
    useDateRangePreset('6-months');

  const { data: overviewData, isLoading: isOverviewLoading } =
    useOverview(dateRangeStr);

  console.log(overviewData);

  const { data: monthlyTotalsData, isLoading: monthlyTotalsDataLoading } =
    useMonthlyTotals(dateRangeStr);

  const { data: categoryTotalsResult, isLoading: isCategoryTotalsLoading } =
    useCategoryTotals(dateRangeStr);

  const { data: merchantCounts } = useMerchantCounts(dateRangeStr);

  const getDescription = function () {
    switch (datePreset) {
      case '1-day':
        return 'Displaying last 1 day';
      case '7-days':
        return 'Displaying last 7 days';
      case '1-month':
        return 'Displaying last 1 month';
      case 'mtd':
        return 'Displaying month to date';
      case '3-months':
        return 'Displaying last 3 months';
      case '6-months':
        return 'Displaying last 6 months';
      case '1-year':
        return 'Displaying last 1 year';
      case 'ytd':
        return 'Displaying year to date';
      case '3-years':
        return 'Displaying last 3 years';

      default:
        return null;
    }
  };

  const description = getDescription();

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div>
          <div className="mb-4 space-y-2">
            <DateRangePickerPreset
              dateRange={dateRange}
              onRangeSelect={setDateRange}
              datePreset={datePreset}
              onDatePresetChange={setDatePreset}
            />
            {description && (
              <p className="text-[0.8rem] text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className="grid gap-8">
            <div className="grid grid-cols-4 gap-8">
              <MetricCard
                title="Total amount"
                value={
                  overviewData?.total_amount && `$${overviewData.total_amount}`
                }
                loading={isOverviewLoading}
              />
              <MetricCard
                title="Average receipt total"
                value={
                  overviewData?.avg_receipt_total &&
                  `$${overviewData.avg_receipt_total}`
                }
                loading={isOverviewLoading}
              />
              <MetricCard
                title="Receipt count"
                value={
                  overviewData?.receipt_count && `${overviewData.receipt_count}`
                }
                loading={isOverviewLoading}
              />
            </div>
            <div>
              <MonthlyTotalsCard
                data={monthlyTotalsData}
                loading={monthlyTotalsDataLoading}
                dateRange={dateRange}
                datePreset={datePreset}
              />
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              <CategoriesCard
                data={categoryTotalsResult || []}
                loading={isCategoryTotalsLoading}
              />
              <MerchantsCard data={merchantCounts || []} />
            </div>
          </div>
        </div>
      }
    />
  );
}
