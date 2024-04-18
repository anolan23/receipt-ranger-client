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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMonthlySpending } from '@/hooks/use-monthly-spending';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { File, ListFilter } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from './components/receipts-table';
export function DashboardPage() {
  const { data: receipts } = useReceipts({ limit: 5 });
  const { rowSelection, setRowSelection, selectedRow } = useRowSelection({
    data: receipts,
  });
  const { data: receipt } = useReceipt(selectedRow?.id.toString());

  const { data: monthlySpending, isLoading: isMonthlySpendingLoading } =
    useMonthlySpending(new Date().getFullYear());
  const { data: spendingOverview, isLoading: isSpendingOverviewLoading } =
    useSpendingOverview();

  const getMonlthySpendPercentDiff = (
    current_month_spend: number,
    previous_month_spend: number
  ) => {
    //Percent = (Current Month Spend - Previous Month Spend) / Previous Month Spend * 100

    const percent = Math.round(
      ((current_month_spend - previous_month_spend) / previous_month_spend) *
        100
    );
    if (Number.isNaN(percent)) return 'More data needed';
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent}% from last month`;
  };

  const getPercentDiff = function (num1: number, num2: number) {
    return Math.min(Math.round((num1 / num2) * 100), 100);
  };

  useEffect(() => {
    if (!receipts?.length) return;
    setRowSelection({ '0': true });
  }, [receipts, setRowSelection]);

  const { current_month_spend, forecasted_spend, previous_month_spend } =
    spendingOverview || {};

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
      breadcrumbs={
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-2xl">
          Dashboard
        </h1>
      }
      content={
        <div className="space-y-4">
          <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                  <CardHeader className="pb-3">
                    <CardTitle>Receipts Overview</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
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
                  title="Current Month Spend"
                  value={
                    current_month_spend
                      ? `$${Math.round(+current_month_spend)}`
                      : ''
                  }
                  description={
                    current_month_spend && previous_month_spend
                      ? getMonlthySpendPercentDiff(
                          +current_month_spend,
                          +previous_month_spend
                        )
                      : undefined
                  }
                  percent={percentMonth}
                />
                <MetricCard
                  title="Forecasted"
                  value={
                    forecasted_spend ? `$${Math.round(+forecasted_spend)}` : ''
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
              <Tabs defaultValue="week">
                <div className="flex items-center">
                  <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                  <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-sm"
                        >
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only">Filter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                          Fulfilled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Declined
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                          Refunded
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-sm"
                    >
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Export</span>
                    </Button>
                  </div>
                </div>
                <TabsContent value="week">
                  <Card x-chunk="dashboard-05-chunk-3">
                    <CardHeader className="px-7">
                      <CardTitle>Receipts</CardTitle>
                      <CardDescription>
                        Recently scanned receipts.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReceiptsTable
                        rowSelection={rowSelection}
                        onRowSelectionChange={setRowSelection}
                        variant="embedded"
                        selectionType="single"
                        data={receipts || []}
                        footerControls={(table) => (
                          <>
                            <div className="flex-1 text-sm text-muted-foreground">
                              {table.getFilteredSelectedRowModel().rows.length}{' '}
                              of {table.getFilteredRowModel().rows.length}{' '}
                              row(s) selected.
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                              >
                                Next
                              </Button>
                            </div>
                          </>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <ReceiptCard receipt={receipt} />
            </div>
          </div>
        </div>
      }
    />
  );
}
