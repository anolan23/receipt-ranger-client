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

  const formatDollarString = (value?: string) => {
    if (!value) return;
    const comparisonNum = +value;
    return `${comparisonNum >= 0 ? '+' : '-'}$${Math.abs(comparisonNum).toFixed(
      2
    )}`;
  };
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'This Month’s Spending',
            value: `$${spendingOverview?.current_month_spend}`,
            description: spendingOverview?.remaining_budget
              ? `${formatDollarString(
                  spendingOverview.remaining_budget
                )} remaining in budget`
              : undefined,
          }}
        />
        <MetricCard
          loading={isSpendingOverviewLoading}
          metric={{
            title: 'Forecasted Month Spend',
            value: `$${spendingOverview?.forecasted_spend}`,
            description: spendingOverview?.comparison
              ? `${formatDollarString(
                  spendingOverview.comparison
                )} from last month`
              : undefined,
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
