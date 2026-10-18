import { Cards } from '@/components/cards';
import { Header } from '@/components/header';
import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Pagination } from '@/components/pagination';
import { ReceiptSheet } from '@/components/receipt-sheet';
import { ReceiptCardLink } from '@/components/receipt-card-link';
import { TextFilter } from '@/components/text-filter';
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
import { useToast } from '@/components/ui/use-toast';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReceipt } from '@/queries/receipts';
import { useReceipts } from '@/queries/receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { downloadReceipts } from '@/lib/api/receipts';
import { Table } from '@tanstack/react-table';
import { Download, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ReceiptsTable } from '../../../components/receipts-table';

export function ReceiptsPage() {
  usePageTitle('Receipts');
  const isMobile = useDeviceWidth();
  const {
    data: receipts,
    refetch: refetchReceipts,
    isLoading: isReceiptsLoading,
  } = useReceipts();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const query = searchParams.get('q');

  const { rowSelection, setRowSelection, selectedRow, prevRow, nextRow } =
    useRowSelection({
      selectFirstOnMOunt: false,
      data: receipts,
    });
  const { data: receipt, isLoading: isReceiptLoading } = useReceipt(
    selectedRow?.id.toString(),
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
    [getOptions],
  );

  const getMerchantOptions = useCallback(
    (table: Table<any>) => {
      const options = getOptions(table, 'merchant');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions],
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
        variant: 'oops',
        title: "Oops, that export didn't work",
        description: 'Try exporting again?',
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
                <Link to="/dashboard">Overview</Link>
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
        <div className="grid flex-1 items-start gap-4">
          <Header
            title="Your receipts"
            description="Every receipt I've read, ready to search and sort."
          />
          <ReceiptsTable
            tools={(table) => {
              const isFiltered = table.getState().columnFilters.length > 0;

              return (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TextFilter
                      table={table}
                      placeholder="Search receipts…"
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
                          { label: 'Needs a look', value: false },
                          { label: 'Looks good', value: true },
                        ]}
                      />
                    )}
                    {isFiltered && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                      >
                        Reset
                        <X aria-hidden className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleExportClick}
                      size="sm"
                      variant="secondary"
                      disabled={downloading}
                    >
                      <Download aria-hidden />
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
          />
          <Cards
            hidden={!isMobile}
            title="Your receipts"
            loading={isReceiptsLoading}
            loadingText="Counting the coupons…"
            emptyText="No receipts yet. Let's scan your first one!"
            data={receipts || []}
            renderCard={(receipt) => (
              <ReceiptCardLink key={receipt.id} receipt={receipt} />
            )}
          />
          <ReceiptSheet
            open={!isMobile && !!selectedRow}
            receipt={receipt}
            onClose={() => setRowSelection({})}
            onPreviousClick={prevRow}
            onNextClick={nextRow}
            onDeleteSuccess={() => {
              setRowSelection({});
              refetchReceipts();
            }}
          />
        </div>
      }
    />
  );
}
