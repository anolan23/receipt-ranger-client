import { MetricCard } from './metric-card';
import { MonthlySpendingCard } from './monthly-spending-card';
import { RecentReceiptsCard } from './recent-receipts-card';

interface OverviewProps {}

export function Overview({ ...props }: OverviewProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          metric={{
            title: 'This Month’s Spending',
            value: '$751',
            description: '$249 remaining in budget',
          }}
        />
        <MetricCard
          metric={{
            title: 'Forecasted Month Spend',
            value: '$1,340',
            description: '+20.1% from last month',
          }}
        />
        <MetricCard
          metric={{
            title: 'Budget Savings YTD',
            value: '$2,435',
          }}
        />
        <MetricCard
          metric={{
            title: 'Monthly Spending Total',
            value: '$751',
            description: '+20.1% from last month',
          }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlySpendingCard />
        <RecentReceiptsCard />
      </div>
    </>
  );
}
