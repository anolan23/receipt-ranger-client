import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import {
  CategoryData,
  ItemData,
  ReceiptData,
  SubcategoryData,
} from '@/lib/types';
import { LineItemsEditor } from './line-items-editor';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import { useMemo, useRef } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2Icon } from 'lucide-react';
import { Select } from '@/components/select';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { EditReceiptFormValues, ItemUpdatePayload } from '../interfaces';

interface LineItemsCardProps {
  subcategories?: SubcategoryData[];
}

export function LineItemsCard({ subcategories, ...props }: LineItemsCardProps) {
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
                      className="max-w-[75px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          );
        },
        enableSorting: false,
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
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="max-w-[75px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          );
        },
        enableSorting: false,
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
    <Card>
      <CardHeader>
        <CardTitle>Line Items</CardTitle>
        {/* <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={fields}
          variant="embedded"
          getRowId={(originalRow) => originalRow.id}
        />
      </CardContent>
      <CardFooter className="justify-center border-t p-4">
        <Button
          type="button"
          onClick={() =>
            append({
              name: '',
              quantity: 1,
            })
          }
          size="sm"
          variant="ghost"
          className="gap-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add Item
        </Button>
      </CardFooter>
    </Card>
  );
}
