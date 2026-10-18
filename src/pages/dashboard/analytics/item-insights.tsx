import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { DataTableFacetedFilter } from '@/components/data-table-faceted-filter';
import { ItemsTable } from '@/components/items-table';
import { Pagination } from '@/components/pagination';
import { TextFilter } from '@/components/text-filter';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDateRangePresetOutletContext } from '@/hooks/use-date-range-preset';
import { useItems } from '@/queries/items';
import { usePageTitle } from '@/hooks/use-page-title';
import { useSubcategoryTotals } from '@/queries/analytics';
import { useTopBaseItems } from '@/queries/analytics';
import { ItemData } from '@/lib/types';
import { X } from 'lucide-react';
import { ColumnFiltersState, Table } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import { SubcategoriesCard } from './components/subcategories-card';
import { TopBaseItemCard } from './components/top-base-items-card';
interface ItemInsightsPageProps {}

export function ItemInsightsPage({ ...props }: ItemInsightsPageProps) {
  usePageTitle('Item Insights');

  const { dateInterval } = useDateRangePresetOutletContext();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 lg:grid-cols-8">
        <SubcategoriesCard
          data={subcategoryTotalsResult || []}
          loading={isSubcategoryTotalsLoading}
          onCategoryClick={(category) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== 'subcategory'),
              { id: 'subcategory', value: [category] },
            ])
          }
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
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        tools={(table) => {
          const isFiltered = table.getState().columnFilters.length > 0;
          return (
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <TextFilter table={table} placeholder="Search items…" />
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
                        size="sm"
                        onClick={() => table.resetColumnFilters()}
                      >
                        Reset
                        <X aria-hidden className="size-4" />
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
            <CardTitle>Everything you bought</CardTitle>
            <CardDescription>
              Every item I found on your receipts
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
