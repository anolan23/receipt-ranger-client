import { DataTable } from '@/components/data-table';
import { DeleteReceiptMenuItem } from '@/components/delete-receipt-menu-item';
import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useRowSelection } from '@/hooks/use-row-selection';
import { deleteReceipt } from '@/lib/api/receipts';
import { ItemData, ReceiptData } from '@/lib/types';
import {
  DotsHorizontalIcon,
  DotsVerticalIcon,
  MixerVerticalIcon,
} from '@radix-ui/react-icons';
import { RowSelectionState, createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';

interface ReceiptsTableProps {
  receipts?: ReceiptData[];
}

export function ReceiptsTable({ receipts, ...props }: ReceiptsTableProps) {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const { rowSelection, setRowSelection, selectedRow } = useRowSelection({
    data: receipts,
  });
  const columnHelper = createColumnHelper<ReceiptData>();
  const columns = [
    columnHelper.display({
      id: 'select',
      // header: ({ table }) => (
      //   <Checkbox
      //     checked={
      //       table.getIsAllPageRowsSelected() ||
      //       (table.getIsSomePageRowsSelected() && 'indeterminate')
      //     }
      //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //     aria-label="Select all"
      //   />
      // ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('store_name', {
      id: 'store',
      header: 'Store',
      cell: (info) => {
        const { id } = info.row.original;
        return <Link to={`/receipts/${id}`}>{info.getValue()}</Link>;
      },
    }),
    columnHelper.accessor('created_at', {
      id: 'Upload date',
      header: 'Upload date',
      cell: (info) => {
        return dayjs(info.row.original.created_at).format(
          'MMMM D, YYYY h:mm A'
        );
      },
    }),
    columnHelper.accessor('transaction_date', {
      id: 'Receipt date',
      header: 'Receipt date',
      cell: (info) => {
        return dayjs(info.row.original.transaction_date).format(
          'MMMM D, YYYY h:mm A'
        );
      },
    }),
    columnHelper.accessor('total_amount', {
      id: 'total',
      header: 'Total',
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ];

  const handleDeleteSubmit = async function (receipt: ReceiptData) {
    try {
      if (!receipt?.id) return;
      await deleteReceipt(receipt.id);
      setRowSelection({});
      mutate('/receipts');
      toast({
        description: 'Receipt deleted',
      });
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        description: message,
      });
    }
  };

  return (
    <DataTable
      columns={columns}
      data={receipts || []}
      selectionType="single"
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      filter={(table) => (
        <>
          <Input
            placeholder="Filter store..."
            value={(table.getColumn('store')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('store')?.setFilterValue(event.target.value)
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DeleteReceiptMenuItem
                  receipt={selectedRow}
                  onDeleteSubmit={handleDeleteSubmit}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    />
  );
}
