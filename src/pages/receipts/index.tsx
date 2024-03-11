import { useReceipts } from '@/hooks/use-receipts';
import { ReceiptsTable } from './components/receipts-table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MixerVerticalIcon } from '@radix-ui/react-icons';

interface ReceiptsPageProps {}

export function ReceiptsPage({ ...props }: ReceiptsPageProps) {
  const { data: receipts } = useReceipts();

  return (
    <>
      <div className="flex items-center space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Receipts</h2>
          <p className="text-muted-foreground">
            Here's a list of your uploaded receipts
          </p>
        </div>
      </div>
      <ReceiptsTable
        data={receipts || []}
        filter={(table) => (
          <>
            <Input
              placeholder="Filter by merchant..."
              value={
                (table.getColumn('merchant')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('merchant')?.setFilterValue(event.target.value)
              }
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <div className="ml-auto flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MixerVerticalIcon className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
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
    </>
  );
}
