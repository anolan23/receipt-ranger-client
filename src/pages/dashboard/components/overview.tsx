import { useMonthlySpending } from '@/hooks/use-monthly-spending';
import { useReceipts } from '@/hooks/use-receipts';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { MetricCard } from './metric-card';
import { MonthlySpendingCard } from './monthly-spending-card';
import { RecentReceiptsCard } from './recent-receipts-card';

interface OverviewProps {}

export function Overview({ ...props }: OverviewProps) {
  const { data: receipts, isLoading: isReceiptsLoading } = useReceipts();
  const { data: monthlySpending, isLoading: isMonthlySpendingLoading } =
    useMonthlySpending(new Date().getFullYear());
  const { data: spendingOverview, isLoading: isSpendingOverviewLoading } =
    useSpendingOverview();
  const renderComparisonString = function (comparison?: string) {
    if (!comparison) return;
    const comparisonNum = +comparison;
    if (comparisonNum >= 0) {
      return `+$${comparisonNum.toFixed(2)} from last month`;
    } else {
      return `-$${Math.abs(comparisonNum).toFixed(2)} from last month`;
    }
  };
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'This Month’s Spending',
            value: `$${spendingOverview?.current_month_spend}`,
            description: '$249 remaining in budget',
          }}
        />
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'Forecasted Month Spend',
            value: `$${spendingOverview?.forecasted_spend}`,
            description: renderComparisonString(spendingOverview?.comparison),
          }}
        />
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'Budget Savings YTD',
            value: '$2,435',
          }}
        />
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'Monthly Spending Total',
            value: '$751',
            description: '+20.1% from last month',
          }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlySpendingCard
          monthlySpending={monthlySpending}
          loading={isMonthlySpendingLoading}
        />
        <RecentReceiptsCard receipts={receipts} loading={isReceiptsLoading} />
      </div>
    </>
  );
}
