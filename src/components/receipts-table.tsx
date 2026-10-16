import { DataTable, DataTableProps } from '@/components/data-table';
import { Link } from '@/components/link';
import { ReceiptData } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { CircleAlertIcon } from 'lucide-react';
import { ImageLogo } from './image-logo';
import { Badge } from './ui/badge';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { StatusIndicator } from './status-indicator';
import { getFileUrl } from '@/lib/helpers';

interface ReceiptsTableProps
  extends Omit<DataTableProps<ReceiptData>, 'columns'> {}

export function ReceiptsTable({ ...props }: ReceiptsTableProps) {
  const isMobile = useDeviceWidth();
  const columnHelper = createColumnHelper<ReceiptData>();
  const columns = [
    columnHelper.display({
      id: 'receipt',
      header: 'Receipt',
      cell: ({ row }) => {
        const { id } = row.original;
        return (
          <Link to={`/dashboard/receipts/${id}`}>{String(id).slice(0, 8)}</Link>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 120,
    }),
    columnHelper.accessor('merchant.name', {
      id: 'merchant',
      header: 'Merchant',
      enableSorting: false,
      enableHiding: false,
      cell: ({ row, getValue }) => (
        <div className="flex items-center gap-3">
          <ImageLogo
            src={
              row.original.merchant.logo_url
                ? getFileUrl(row.original.merchant.logo_url)
                : undefined
            }
            size={40}
            className="shrink-0"
          />
          <span>{getValue()}</span>
          {row.original.possible_duplicate_of ? (
            <Badge
              variant="outline"
              className="gap-1 border-orange-300 text-orange-700"
            >
              <CircleAlertIcon className="h-3 w-3" />
              Possible duplicate
            </Badge>
          ) : null}
        </div>
      ),
      size: 200,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    }),
    columnHelper.accessor('category.label', {
      id: 'category',
      header: 'Category',
      enableSorting: false,
      cell: (info) => {
        const value = info.getValue();
        if (!value) return '-';
        return <Badge variant="outline">{value}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 150,
    }),
    columnHelper.accessor('reviewed', {
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => {
        const value = info.getValue();
        if (value)
          return <StatusIndicator status="success">Reviewed</StatusIndicator>;
        return <StatusIndicator status="pending">Pending</StatusIndicator>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      size: 150,
    }),
    columnHelper.accessor('transaction_date', {
      id: 'transaction_date',
      header: 'Transaction date',
      cell: (info) => {
        return dayjs(info.row.original.transaction_date).format('YYYY/MM/DD');
      },
      enableSorting: true,
      sortingFn: (rowA, rowB, columnId) => {
        const dateA = new Date(rowA.getValue(columnId));
        const dateB = new Date(rowB.getValue(columnId));

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
      },
      size: 150,
    }),
    // columnHelper.display({
    //   id: 'status',
    //   header: 'Status',
    //   cell: () => {
    //     return <Badge variant="outline">Reviewed</Badge>;
    //     // return <Badge variant="destructive">Needs review</Badge>;
    //   },
    // }),
    columnHelper.accessor('total_amount', {
      id: 'total',
      header: 'Total',
      cell: (info) => `$${info.getValue()}`,
      enableSorting: true,
      enableHiding: false,
      size: 100,
    }),

    columnHelper.accessor('created_at', {
      id: 'created_at',
      header: 'Upload date',
      cell: (info) => {
        return dayjs(info.row.original.created_at).format('YYYY/MM/DD h:mm A');
      },
      enableSorting: true,
      size: 150,
    }),
    // columnHelper.display({
    //   id: 'actions',
    //   cell: ({ row }) => {
    //     return <ActionsDropdown receipt={row.original} />;
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // }),
  ];

  return (
    <DataTable
      columns={columns}
      selectionType="single"
      empty={'No Receipts found'}
      hidden={isMobile}
      wrapLines={false}
      initialColumnVisibility={{ created_at: false }}
      {...props}
    />
  );
}
