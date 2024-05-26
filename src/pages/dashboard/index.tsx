import { MetricCard } from '@/components/metric-card';
import { ReceiptCard } from '@/components/receipt-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { toDollar } from '@/lib/helpers';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../../components/receipts-table';
export function DashboardPage() {
  const { data: receipts, mutate: mutateReceipts } = useReceipts({ limit: 5 });
  const { rowSelection, setRowSelection, selectedRow, nextRow, prevRow } =
    useRowSelection({
      selectFirstOnMOunt: true,
      data: receipts,
    });
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    selectedRow?.id.toString()
  );

  const { data: spendingOverview, isLoading: isSpendingOverviewLoading } =
    useSpendingOverview();

  const getMonlthySpendPercentDiff = (num1: number, num2: number) => {
    const frac = (num1 - num2) / num2;
    const percent = Math.round(frac * 100);
    if (Number.isNaN(percent)) return `+0% from last month`;
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent}% from last month`;
  };

  const getPercentDiff = function (num1: number, num2: number) {
    return Math.min(Math.round((num1 / num2) * 100), 100);
  };

  const { current_month_spend, forecasted_spend, previous_month_spend } =
    spendingOverview || {};

  const currentMonthDescription =
    current_month_spend && previous_month_spend
      ? getMonlthySpendPercentDiff(+current_month_spend, +previous_month_spend)
      : undefined;

  const percentMonth =
    current_month_spend && previous_month_spend
      ? getPercentDiff(+current_month_spend, +previous_month_spend)
      : 0;

  const percentForcasted =
    forecasted_spend && current_month_spend
      ? getPercentDiff(+forecasted_spend, +current_month_spend)
      : 0;

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
                      Introducing Your Receipts Dashboard for Seamless
                      Management and Insightful Analysis.
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
                    forecasted_spend && current_month_spend
                      ? getMonlthySpendPercentDiff(
                          +forecasted_spend,
                          +current_month_spend
                        )
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
              />
            </div>
            <div>
              <ReceiptCard
                receipt={receipt}
                loading={isReceiptLoading}
                onPreviousClick={prevRow}
                onNextClick={nextRow}
                onDeleteSuccess={() => mutateReceipts()}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
