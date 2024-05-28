import { DataTable } from '@/components/data-table';
import { DollarInput } from '@/components/dollar-input';
import { Select } from '@/components/select';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubcategoryData } from '@/lib/types';
import { createColumnHelper } from '@tanstack/react-table';
import { PlusCircle, Trash2Icon } from 'lucide-react';
import { useMemo } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { EditReceiptFormValues } from '../interfaces';

interface LineItemsTableProps {
  subcategories?: SubcategoryData[];
}

export function LineItemsTable({
  subcategories,
  ...props
}: LineItemsTableProps) {
  const { control } = useFormContext<EditReceiptFormValues>();
  const { fields, append, remove } = useFieldArray<EditReceiptFormValues>({
    control,
    name: 'items',
  });

  const columnHelper = useMemo(
    () =>
      createColumnHelper<
        FieldArrayWithId<EditReceiptFormValues, 'items', 'id'>
      >(),
    []
  );

  const selectItems = useMemo(() => {
    return (
      subcategories?.map((cat) => {
        return {
          label: cat.name,
          value: cat.id.toString(),
        };
      }) || []
    );
  }, [subcategories]);

  const columns = useMemo(() => {
    return [
      columnHelper.accessor('name', {
        header: 'Item name',
        cell: ({ row }) => {
          return (
            <FormField
              control={control}
              name={`items.${row.index}.name`}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Item name"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          );
        },
        enableSorting: false,
        minSize: 250,
      }),
      columnHelper.accessor('subcategory_id', {
        header: 'Category',
        cell: ({ row, ...info }) => {
          return (
            <FormField
              control={control}
              name={`items.${row.index}.subcategory_id`}
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Select Item Category"
                    items={selectItems}
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                );
              }}
            />
          );
        },
        enableSorting: false,
        size: 200,
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: ({ row }) => {
          return (
            <FormField
              control={control}
              name={`items.${row.index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          );
        },
        enableSorting: false,
        size: 100,
      }),
      columnHelper.accessor('price', {
        header: 'Total Price',
        cell: ({ row }) => {
          return (
            <FormField
              control={control}
              name={`items.${row.index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DollarInput
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          );
        },
        enableSorting: false,
        size: 150,
      }),
      columnHelper.display({
        id: 'action',
        header: '',
        cell: ({ row }) => {
          return (
            <Button
              type="button"
              onClick={() => {
                remove(row.index);
              }}
              variant="outline"
              size="icon"
              className="h-7 w-7"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          );
        },
        enableSorting: false,
        size: 30,
      }),
    ];
  }, [control, remove, columnHelper, selectItems]);

  return (
    <div className="flex flex-col gap-2">
      <DataTable
        columns={columns}
        data={fields}
        variant="border"
        getRowId={(originalRow) => originalRow.id}
      />
      <Button
        type="button"
        onClick={() =>
          append({
            name: '',
            quantity: 1,
          })
        }
        variant="outline"
        className="gap-1"
      >
        <PlusCircle className="h-3.5 w-3.5" />
        Add Item
      </Button>
    </div>
  );
}
