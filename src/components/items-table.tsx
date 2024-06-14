import { DataTable, DataTableProps } from '@/components/data-table';
import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface ItemsTableProps extends Omit<DataTableProps<ItemData>, 'columns'> {}

export function ItemsTable({ ...props }: ItemsTableProps) {
  const columnHelper = createColumnHelper<ItemData>();
  const columns = [
    columnHelper.accessor('generated_item_name', {
      id: 'generated_item_name',
      header: 'Item name',
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('item_name_raw', {
      id: 'item_name_raw',
      header: 'Item raw name',
      enableSorting: false,
    }),
    columnHelper.accessor('base_item_type', {
      id: 'base_item_type',
      header: 'Base item type',
      enableSorting: false,
      cell: (info) => {
        const value = info.getValue();
        return value;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('receipt_id', {
      id: 'receipt_id',
      header: 'Receipt ID',
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        return (
          <Button variant="link" asChild>
            <Link to={`/dashboard/receipts/${value}`}>
              {value.slice(0, 12) + '...'}
            </Link>
          </Button>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('subcategory', {
      id: 'subcategory',
      header: 'Item category',
      enableSorting: true,
      cell: (info) => {
        const value = info.getValue();
        if (!value) return '-';
        return <Badge variant="outline">{value}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('quantity', {
      id: 'quantity',
      header: 'Quantity',
      enableSorting: true,
    }),
    columnHelper.accessor('price_per_unit', {
      id: 'price_per_unit',
      header: 'Price per unit',
      cell: (info) => {
        const value = info.getValue();
        return value ? toDollar(value, 'cent') : '-';
      },
      enableSorting: true,
      enableHiding: false,
    }),
    columnHelper.accessor('total_price', {
      id: 'total',
      header: 'Item total',
      cell: (info) => {
        const value = info.getValue();
        return value ? toDollar(value, 'cent') : '-';
      },
      enableSorting: true,
      enableHiding: false,
    }),
  ];

  return <DataTable columns={columns} empty={'No Items found'} {...props} />;
}
