import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { ItemsTable } from '@/components/items-table';
import { Pagination } from '@/components/pagination';
import { TextFilter } from '@/components/text-filter';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDateRangePreset,
  useDateRangePresetOutletContext,
} from '@/hooks/use-date-range-preset';
import { useItems } from '@/hooks/use-items';
import { usePageTitle } from '@/hooks/use-page-title';
import { useSubcategoryTotals } from '@/hooks/use-subcategory-totals';
import { ItemData } from '@/lib/types';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { useCallback } from 'react';
import { SubcategoriesCard } from './components/subcategories-card';
import { TopBaseItemCard } from './components/top-base-items-card';
import { useTopBaseItems } from '@/hooks/use-top-base-items';
interface ItemInsightsPageProps {}

export function ItemInsightsPage({ ...props }: ItemInsightsPageProps) {
  usePageTitle('Item Insights');

  const { dateInterval } = useDateRangePresetOutletContext();
  const { data: items, isLoading } = useItems(dateInterval);

  const {
    data: subcategoryTotalsResult,
    isLoading: isSubcategoryTotalsLoading,
  } = useSubcategoryTotals(dateInterval);

  const { data: topBaseItems, isLoading: isTopBaseItemsLoading } =
    useTopBaseItems(dateInterval);

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
    <div className="grid gap-8 min-w-0">
      <div className="grid gap-8 lg:grid-cols-8 min-w-0">
        <SubcategoriesCard
          data={subcategoryTotalsResult || []}
          loading={isSubcategoryTotalsLoading}
          className="lg:col-span-5"
        />
        <TopBaseItemCard
          data={topBaseItems || []}
          className="lg:col-span-3"
          loading={isTopBaseItemsLoading}
        />
      </div>
      <ItemsTable
        wrapLines={false}
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
        initialColumnVisibility={{
          item_name_raw: false,
          base_item_type: true,
          receipt_id: false,
        }}
      />
    </div>
  );
}
