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
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { downloadReceipts } from '@/lib/api/receipts';
import { File, ScanText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReceiptsTable } from '../../../components/receipts-table';
import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { TextFilter } from '@/components/text-filter';
import { Pagination } from '@/components/pagination';

export function ReceiptsPage() {
  const { data: receipts, mutate: mutateReceipts } = useReceipts();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const query = searchParams.get('q');

  const { rowSelection, setRowSelection, selectedRow, prevRow, nextRow } =
    useRowSelection({
      selectFirstOnMOunt: !query,
      data: receipts,
    });
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    selectedRow?.id.toString()
  );
  const [globalFilter, setGlobalFilter] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setGlobalFilter(query);
  }, [query, setRowSelection]);

  const handleExportClick = async function () {
    try {
      setDownloading(true);
      await downloadReceipts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export Receipts',
      });
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
            <ReceiptsTable
              tools={(table) => (
                <div className="flex items-center">
                  <TextFilter table={table} placeholder="Filter Receipts..." />
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      onClick={handleExportClick}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={downloading}
                    >
                      <File className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                      </span>
                    </Button>
                    <ColumnFilterDropdown table={table} />
                  </div>
                </div>
              )}
              header={
                <CardHeader>
                  <CardTitle>Receipts</CardTitle>
                  <CardDescription>
                    All of your scanned receipts.
                  </CardDescription>
                </CardHeader>
              }
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              variant="embedded"
              selectionType="single"
              data={receipts || []}
              footerControls={(table) => <Pagination table={table} />}
            />
          </div>
          <ReceiptCard
            receipt={receipt}
            loading={isReceiptLoading}
            onPreviousClick={prevRow}
            onNextClick={nextRow}
            onDeleteSuccess={() => mutateReceipts()}
          />
        </div>
      }
    />
  );
}
