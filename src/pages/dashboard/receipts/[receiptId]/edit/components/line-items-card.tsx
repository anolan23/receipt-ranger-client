import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { CategoryData, ItemData, ReceiptData } from '@/lib/types';
import { LineItemsEditor } from './line-items-editor';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2Icon } from 'lucide-react';
import { Select } from '@/components/select';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { EditReceiptFormValues, ItemUpdatePayload } from '../interfaces';

interface LineItemsCardProps {
  categories?: CategoryData[];
}

export function LineItemsCard({ categories, ...props }: LineItemsCardProps) {
  const { control } = useFormContext<EditReceiptFormValues>();
  const { fields, append, remove } = useFieldArray<EditReceiptFormValues>({
    control,
    name: 'items',
  });
  const columnHelper = createColumnHelper<ItemUpdatePayload>();
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
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Item name"
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
      }),
      columnHelper.accessor('category_id', {
        header: 'Category',
        cell: ({ row }) => {
          return (
            <FormField
              control={control}
              name={`items.${row.index}.category_id`}
              render={({ field }) => {
                return (
                  <Select
                    placeholder="Select category"
                    items={
                      categories?.map((cat) => {
                        return {
                          label: cat.label,
                          value: cat.id.toString(),
                        };
                      }) || []
                    }
                    value={field.value?.toString() || undefined}
                    onValueChange={(value) =>
                      field.onChange(value ? +value : undefined)
                    }
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
                <Input
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
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
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={field.value || ''}
                  onChange={field.onChange}
                />
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
              onClick={() => remove(row.index)}
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
  }, [columnHelper, control, categories, remove]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Items</CardTitle>
        {/* <CardDescription>
          Lipsum dolor sit amet, consectetur adipiscing elit
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={fields || []} variant="embedded" />
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
