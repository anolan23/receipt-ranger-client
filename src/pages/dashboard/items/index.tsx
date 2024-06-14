import { DashboardLayout } from '@/layout/dashboard-layout';
import { ItemsTable } from '@/components/items-table';
import { useItems } from '@/hooks/use-items';
import { TextFilter } from '@/components/text-filter';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { Table } from '@tanstack/react-table';
import { ItemData } from '@/lib/types';
import { Pagination } from '@/components/pagination';
import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ItemsPageProps {}

export function ItemsPage({ ...props }: ItemsPageProps) {
  const { data: items, isLoading } = useItems();

  const getOptions = useCallback((table: Table<ItemData>, columnId: string) => {
    const options = new Set<string>();

    table.getCoreRowModel().flatRows.forEach((row) => {
      const value = row.getValue(columnId) as string;
      options.add(value);
    });
    return options;
  }, []);

  const getBaseItemTypeOptions = useCallback(
    (table: Table<ItemData>) => {
      const options = getOptions(table, 'base_item_type');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions]
  );
  const getCategoryOptions = useCallback(
    (table: Table<ItemData>) => {
      const options = getOptions(table, 'subcategory');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions]
  );
  const getReferenceOptions = useCallback(
    (table: Table<ItemData>) => {
      const options = getOptions(table, 'receipt_id');
      return Array.from(options).map((val) => {
        return { label: val, value: val };
      });
    },
    [getOptions]
  );

  return (
    <DashboardLayout
      content={
        <div>
          <ItemsTable
            data={items || []}
            tools={(table) => {
              const isFiltered = table.getState().columnFilters.length > 0;
              return (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TextFilter table={table} placeholder="Filter Items..." />
                    {table.getColumn('subcategory') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('subcategory')}
                        title="Category"
                        options={getCategoryOptions(table)}
                      />
                    )}
                    {table.getColumn('base_item_type') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('base_item_type')}
                        title="Base item"
                        options={getBaseItemTypeOptions(table)}
                      />
                    )}
                    {table.getColumn('receipt_id') && (
                      <DataTableFacetedFilter
                        column={table.getColumn('receipt_id')}
                        title="Receipt ID"
                        options={getReferenceOptions(table)}
                      />
                    )}
                    {isFiltered && (
                      <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                      >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ColumnFilterDropdown table={table} />
                  </div>
                </div>
              );
            }}
            header={
              <CardHeader>
                <CardTitle>Receipt Items</CardTitle>
                <CardDescription>
                  All Items extracted from your receipts
                </CardDescription>
              </CardHeader>
            }
            variant="embedded"
            footerControls={(table) => <Pagination table={table} />}
            loading={isLoading}
            initialColumnVisibility={{ item_name_raw: false }}
          />
        </div>
      }
    />
  );
}
