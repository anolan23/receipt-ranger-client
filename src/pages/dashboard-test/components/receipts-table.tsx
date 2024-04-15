import { DataTable, DataTableProps } from '@/components/data-table';
import { Link } from '@/components/link';
import { ReceiptData } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ActionsDropdown } from '../receipts/components/actions-dropdown';
import { Badge } from '@/components/ui/badge';

interface ReceiptsTableProps
  extends Omit<DataTableProps<ReceiptData>, 'columns'> {}

export function ReceiptsTable({ ...props }: ReceiptsTableProps) {
  const columnHelper = createColumnHelper<ReceiptData>();
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
    columnHelper.accessor('merchant.name', {
      id: 'merchant',
      header: 'Merchant',
      cell: (info) => {
        const receipt = info.row.original;
        return (
          // <div className="flex items-center space-x-3">
          //   <Avatar className="h-8 w-8">
          //     <AvatarImage src={receipt.merchant.logo_url || undefined} />
          //     <AvatarFallback></AvatarFallback>
          //   </Avatar>
          //   <Link to={`/receipts/${receipt.id}`}>{info.getValue()}</Link>
          // </div>
          // <Link to={`/receipts/${receipt.id}`}>{info.getValue()}</Link>
          <div className="font-medium">{info.getValue()}</div>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor('transaction_date', {
      id: 'transaction_date',
      header: 'Transaction date',
      cell: (info) => {
        return dayjs(info.row.original.transaction_date).format('YYYY/MM/DD');
      },
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: () => {
        return <Badge variant="outline">Reviewed</Badge>;
        // return <Badge variant="destructive">Needs review</Badge>;
      },
    }),
    columnHelper.accessor('total_amount', {
      id: 'total',
      header: 'Total',
      cell: (info) => `$${info.getValue()}`,
      enableSorting: false,
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

  return <DataTable columns={columns} selectionType="single" {...props} />;
}
