import {
  ColumnDef,
  ColumnFiltersState,
  Table as ITable,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import React, { ReactNode, useMemo } from 'react';
import { Button } from './ui/button';
import { Loader } from './loader';
import { Checkbox } from './ui/checkbox';

type ColumnVisibilty<TData> = {
  [Key in keyof TData]?: boolean;
};

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  selectionType?: 'single' | 'multiple';
  rowSelection?: RowSelectionState;
  variant?: 'default' | 'embedded';
  initialColumnVisibility?: ColumnVisibilty<TData>;
  loading?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  filter?: (table: ITable<TData>) => ReactNode;
  footerControls?: (table: ITable<TData>) => ReactNode;
}

export function DataTable<TData>({
  selectionType,
  columns,
  data,
  rowSelection = {},
  variant = 'default',
  initialColumnVisibility,
  loading,
  onRowSelectionChange,
  filter,
  footerControls,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ ...initialColumnVisibility });

  const columnHelper = createColumnHelper<TData>();
  const internalColumns = useMemo(() => {
    if (selectionType === 'single') {
      return [
        columnHelper.display({
          id: 'selection',
          cell: ({ row }) => {
            const toggleRow = row.getToggleSelectedHandler();

            return (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => toggleRow(checked)}
              />
            );
          },
        }),
        ...columns,
      ];
    } else return columns;
  }, [columns, columnHelper, selectionType]);

  const table = useReactTable({
    data,
    columns: internalColumns,
    enableMultiRowSelection: selectionType === 'multiple',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: onRowSelectionChange,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div>
      {filter && <div className="flex items-center py-4">{filter(table)}</div>}
      <div className={cn(variant === 'default' && 'rounded-md border')}>
        {loading ? (
          <div className="h-[100px] flex justify-center items-center">
            <Loader size={24} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        // style={{
                        //   width: header.getSize(),
                        // }}
                      >
                        {header.isPlaceholder ? null : (
                          <HeaderCell
                            sortable={header.column.getCanSort()}
                            onClick={() =>
                              header.column.toggleSorting(
                                header.column.getIsSorted() === 'asc'
                              )
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </HeaderCell>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        // style={{
                        //   width: cell.column.getSize(),
                        // }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {footerControls && (
        <div className="flex items-center justify-between px-2 mt-4">
          {footerControls(table)}
        </div>
      )}
    </div>
  );
}
interface HeaderCellProps {
  sortable?: boolean;
  children?: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
function HeaderCell({ sortable, onClick, children }: HeaderCellProps) {
  if (!sortable) return <>{children}</>;
  return (
    <Button variant="ghost" onClick={onClick}>
      {children}
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  );
}
