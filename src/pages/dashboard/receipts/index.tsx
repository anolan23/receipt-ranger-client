import { ReceiptCard } from '@/components/receipt-card';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { File, ScanText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../../../components/receipts-table';
import { downloadReceipts } from '@/lib/api/receipts';
import { toast } from 'sonner';

export function ReceiptsPage() {
  const { data: receipts } = useReceipts();
  const { rowSelection, setRowSelection, selectedRow, prevRow, nextRow } =
    useRowSelection({
      selectFirstOnMOunt: true,
      data: receipts,
    });
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    selectedRow?.id.toString()
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleExportClick = async function () {
    try {
      setDownloading(true);
      await downloadReceipts();
    } catch (error) {
      toast.error('Failed to export Receipts');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout
      breadcrumbs={
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
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
          <div className="lg:col-span-2">
            <div className="flex items-center pb-4">
              <Input
                placeholder="Filter Receipts..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
              <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={handleExportClick}
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1"
                  disabled={downloading}
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Button size="sm" className="h-7 gap-1" asChild>
                  <Link to="/dashboard/scanner">
                    <ScanText className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Scan Receipt
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
                <CardDescription>All of your scanned receipts.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptsTable
                  globalFilter={globalFilter}
                  onGlobalFilterChange={setGlobalFilter}
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
          <ReceiptCard
            receipt={receipt}
            loading={isReceiptLoading}
            onPreviousClick={prevRow}
            onNextClick={nextRow}
          />
        </div>
      }
    />
  );
}
