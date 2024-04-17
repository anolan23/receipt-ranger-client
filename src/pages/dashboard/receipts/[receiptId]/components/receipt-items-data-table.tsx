import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
import { ItemData } from '@/lib/types';
import { DotsHorizontalIcon, MixerVerticalIcon } from '@radix-ui/react-icons';
import { createColumnHelper } from '@tanstack/react-table';
import { EditItemMenuItem } from './edit-item-menu-item';

interface ReceiptItemsDataTableProps {
  items?: ItemData[];
}

export function ReceiptItemsDataTable({
  items,
  ...props
}: ReceiptItemsDataTableProps) {
  const columnHelper = createColumnHelper<ItemData>();
  const columns = [
    // columnHelper.display({
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // }),
    columnHelper.accessor('generated_item_name', {
      id: 'item',
      header: 'Item',
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: 'Category',
    }),
    columnHelper.accessor('quantity', {
      id: 'quantity',
      header: 'Quantity',
    }),
    columnHelper.accessor('item_name_raw', {
      id: 'discount',
      header: 'Discount',
      cell: () => 0,
    }),
    columnHelper.accessor('price_per_unit', {
      id: 'price',
      header: 'Price',
    }),
    columnHelper.accessor('total_price', {
      id: 'total',
      header: 'Total',
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <EditItemMenuItem item={row.original} />
              <DropdownMenuItem>Delete item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ];
  return <DataTable columns={columns} data={items || []} />;
}
