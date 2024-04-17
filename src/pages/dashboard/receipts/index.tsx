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
import { useReceipt } from '@/hooks/use-receipt';
import { useReceipts } from '@/hooks/use-receipts';
import { useRowSelection } from '@/hooks/use-row-selection';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { Link } from 'react-router-dom';
import { ReceiptsTable } from '../components/receipts-table';
export function ReceiptsPage() {
  const { data: receipts } = useReceipts();
  const { rowSelection, setRowSelection, selectedRow } = useRowSelection({
    data: receipts,
  });
  const { data: receipt } = useReceipt(selectedRow?.id.toString());

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
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Receipts</CardTitle>
              <CardDescription>All of your scanned receipts.</CardDescription>
            </CardHeader>
            <CardContent>
              <ReceiptsTable
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                variant="embedded"
                selectionType={undefined}
                data={receipts || []}
                footerControls={(table) => (
                  <>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {table.getFilteredSelectedRowModel().rows.length} of{' '}
                      {table.getFilteredRowModel().rows.length} row(s) selected.
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
      }
    />
  );
}
