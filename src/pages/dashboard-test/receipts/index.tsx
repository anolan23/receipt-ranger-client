import { MetricCard } from '@/components/metric-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReceipts } from '@/hooks/use-receipts';
import { DashboardLayout } from '@/layout/dashboard-layout';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../components/receipts-table';
import { useRowSelection } from '@/hooks/use-row-selection';
import { useReceipt } from '@/hooks/use-receipt';
import { ReceiptCard } from '@/components/receipt-card';
import { useEffect } from 'react';
import { useMonthlySpending } from '@/hooks/use-monthly-spending';
import { useSpendingOverview } from '@/hooks/use-spending-overview';
export function ReceiptsTestPage() {
  const { data: receipts } = useReceipts();
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
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent}% from last month`;
  };

  useEffect(() => {
    if (!receipts?.length) return;
    setRowSelection({ '0': true });
  }, [receipts, setRowSelection]);

  const { current_month_spend, forecasted_spend, previous_month_spend } =
    spendingOverview || {};

  return (
    <DashboardLayout
      breadcrumbs={
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard-test">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Receipts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      content={
        <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Receipts</CardTitle>
                <CardDescription>All of your scanned receipts.</CardDescription>
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
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s)
                        selected.
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
          </div>
          <div>
            <ReceiptCard receipt={receipt} />
          </div>
        </div>
      }
    />
  );
}
