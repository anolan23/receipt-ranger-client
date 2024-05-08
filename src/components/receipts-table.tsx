import { DataTable, DataTableProps } from '@/components/data-table';
import { Link } from '@/components/link';
import { Button } from '@/components/ui/button';
import { ReceiptData } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ReceiptTextIcon } from 'lucide-react';
import { ImageLogo } from './image-logo';
import { Badge } from './ui/badge';

interface ReceiptsTableProps
  extends Omit<DataTableProps<ReceiptData>, 'columns'> {}

export function ReceiptsTable({ ...props }: ReceiptsTableProps) {
  const columnHelper = createColumnHelper<ReceiptData>();
  const columns = [
    // columnHelper.accessor('id', {
    //   id: 'id',
    //   header: 'Receipt Id',
    //   cell: (info) => {
    //     const receipt = info.row.original;
    //     return (
    //       <Button
    //         asChild
    //         variant="link"
    //         className="whitespace-normal text-inherit"
    //       >
    //         <Link to={`/dashboard/receipts/${receipt.id}`}>
    //           {info.getValue()}
    //         </Link>
    //       </Button>
    //     );
    //   },
    //   enableSorting: false,
    // }),
    columnHelper.display({
      id: 'action',
      cell: ({ row }) => {
        const receipt = row.original;
        return (
          <Button asChild variant="outline" size="sm">
            <Link to={`/dashboard/receipts/${receipt.id}`}>
              <ReceiptTextIcon className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.display({
      id: 'logo',
      header: 'Logo',
      cell: ({ row }) => {
        const logoUrl = row.original.merchant.logo_url;
        return <ImageLogo src={logoUrl || undefined} />;
      },
      enableSorting: false,
      enableHiding: false,
    }),

    columnHelper.accessor('merchant.name', {
      id: 'merchant',
      header: 'Merchant',
      enableSorting: false,
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
    }),
    // columnHelper.accessor('created_at', {
    //   id: 'created_at',
    //   header: 'Upload date',
    //   cell: (info) => {
    //     return dayjs(info.row.original.created_at).format('MM/DD/YYYY h:mm A');
    //   },
    // }),
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
      empty={
        <div className="space-y-4 p-8">
          <span>No Receipts found</span>
          <div>
            <Button size="sm" variant="outline" asChild>
              <Link to="/dashboard/scanner">Scan New Receipt</Link>
            </Button>
          </div>
        </div>
      }
      {...props}
    />
  );
}
