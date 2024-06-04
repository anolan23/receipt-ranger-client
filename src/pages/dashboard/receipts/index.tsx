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
import { File, ScanText, Utensils } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReceiptsTable } from '../../../components/receipts-table';
import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { TextFilter } from '@/components/text-filter';
import { Pagination } from '@/components/pagination';
import { usePageTitle } from '@/hooks/use-page-title';
import { Cards } from '@/components/cards';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { ReceiptCardLink } from '@/components/receipt-card-link';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Table } from '@tanstack/react-table';
import { Cross2Icon } from '@radix-ui/react-icons';

export function ReceiptsPage() {
  usePageTitle('Receipts');
  const isMobile = useDeviceWidth();
  const {
    data: receipts,
    mutate: mutateReceipts,
    isLoading: isReceiptsLoading,
  } = useReceipts();
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

  const getOptions = useCallback((table: Table<any>, columnId: string) => {
    const options = new Set<string>();

    table.getCoreRowModel().flatRows.forEach((row) => {
      const value = row.getValue(columnId) as string;
      options.add(value);
    });
    return options;
  }, []);

  const getCategoryOptions = useCallback(
    (table: Table<any>) => {
      const options = getOptions(table, 'category');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions]
  );

  const getMerchantOptions = useCallback(
    (table: Table<any>) => {
      const options = getOptions(table, 'merchant');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions]
  );

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
          <ReceiptsTable
            tools={(table) => {
              const isFiltered = table.getState().columnFilters.length > 0;

              return (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TextFilter
                      table={table}
                      placeholder="Filter Receipts..."
                    />
                    {table.getColumn('merchant') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('merchant')}
                        title="Merchant"
                        options={getMerchantOptions(table)}
                      />
                    )}
                    {table.getColumn('category') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('category')}
                        title="Category"
                        options={getCategoryOptions(table)}
                      />
                    )}
                    {table.getColumn('status') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('status')}
                        title="Status"
                        options={[
                          { label: 'Pending', value: false },
                          { label: 'Reviewed', value: true },
                        ]}
                      />
                    )}
                    {isFiltered && (
                      <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                      >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
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
              );
            }}
            header={
              <CardHeader>
                <CardTitle>Receipts</CardTitle>
                <CardDescription>All of your scanned receipts.</CardDescription>
              </CardHeader>
            }
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            variant="embedded"
            selectionType="single"
            data={receipts || []}
            footerControls={(table) => <Pagination table={table} />}
            loading={isReceiptsLoading}
            className="lg:col-span-2"
          />
          <Cards
            hidden={!isMobile}
            title="Reviewed Receipts"
            loading={isReceiptsLoading}
            loadingText="Loading Receipts"
            emptyText="No Receipts."
            data={receipts || []}
            renderCard={(receipt) => (
              <ReceiptCardLink key={receipt.id} receipt={receipt} />
            )}
          />
          <ReceiptCard
            hidden={isMobile}
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
