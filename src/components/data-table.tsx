import {
  ColumnDef,
  ColumnFiltersState,
  Table as ITable,
  OnChangeFn,
  Row,
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
import { StatusIndicator } from './status-indicator';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';

type ColumnVisibilty<TData> = {
  [Key in keyof TData]?: boolean;
};

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  selectionType?: 'single' | 'multiple';
  rowSelection?: RowSelectionState;
  variant?: 'default' | 'embedded' | 'border';
  initialColumnVisibility?: ColumnVisibilty<TData>;
  loading?: boolean;
  empty?: ReactNode;
  header?: ReactNode;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  tools?: (table: ITable<TData>) => ReactNode;
  footerControls?: (table: ITable<TData>) => ReactNode;
  getRowId?:
    | ((
        originalRow: TData,
        index: number,
        parent?: Row<TData> | undefined
      ) => string)
    | undefined;
}

export function DataTable<TData>({
  selectionType,
  columns,
  data,
  rowSelection = {},
  variant = 'default',
  initialColumnVisibility,
  loading,
  empty,
  header,
  onRowSelectionChange,
  tools,
  footerControls,
  getRowId,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ ...initialColumnVisibility });

  const columnHelper = useMemo(() => createColumnHelper<TData>(), []);
  const internalColumns = useMemo(() => {
    if (selectionType === 'single') {
      return [
        columnHelper.display({
          enableHiding: false,
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
    } else if (selectionType === 'multiple') {
      return [
        columnHelper.display({
          enableHiding: false,
          id: 'selection',
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
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
    onRowSelectionChange,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getRowId,

    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-w-0">
      {tools && <div className="mb-4">{tools(table)}</div>}
      <Card
        className={cn({
          'rounded-md border shadow-none': variant === 'border',
        })}
      >
        {header}
        <CardContent
          className={cn({
            'p-0': variant === 'border',
          })}
        >
          {loading ? (
            <div className="h-[100px] flex justify-center items-center">
              <StatusIndicator status="loading">Loading</StatusIndicator>
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
                      colSpan={columns.length + 1}
                      className="h-24 text-center"
                    >
                      {empty ? empty : 'No results.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {footerControls && <div className="mt-4">{footerControls(table)}</div>}
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
