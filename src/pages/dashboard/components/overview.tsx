import {
  MonthySpendingData,
  ReceiptData,
  SpendingOverviewResult,
} from '@/lib/types';
import { MetricCard } from './metric-card';
import { MonthlySpendingCard } from './monthly-spending-card';
import { RecentReceiptsCard } from './recent-receipts-card';

interface OverviewProps {
  receipts?: ReceiptData[];
  monthlySpending?: MonthySpendingData[];
  spendingOverview?: SpendingOverviewResult;
}

export function Overview({
  receipts,
  monthlySpending,
  spendingOverview,
  ...props
}: OverviewProps) {
  const renderComparisonString = function (comparison?: string) {
    if (!comparison) return;
    const comparisonNum = +comparison;
    if (comparisonNum >= 0) {
      return `+$${comparisonNum} from last month`;
    } else {
      return `-$${Math.abs(comparisonNum)} from last month`;
    }
  };
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          metric={{
            title: 'This Month’s Spending',
            value: `$${spendingOverview?.current_month_spend}`,
            description: '$249 remaining in budget',
          }}
        />
        <MetricCard
          metric={{
            title: 'Forecasted Month Spend',
            value: `$${spendingOverview?.forecasted_spend}`,
            description: renderComparisonString(spendingOverview?.comparison),
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
        <MonthlySpendingCard monthlySpending={monthlySpending} />
        <RecentReceiptsCard receipts={receipts} />
      </div>
    </>
  );
}
