import { DollarInput } from '@/components/dollar-input';
import { LineItem } from '@/components/line-item';
import { Select } from '@/components/select';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ReceiptData, SubcategoryData } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { EditReceiptFormValues } from '../interfaces';
import { useDeviceWidth } from '@/hooks/use-device-width';

interface LineItemsProps {
  receipt: ReceiptData;
  subcategories?: SubcategoryData[];
}

export function LineItems({
  receipt,
  subcategories,
  ...props
}: LineItemsProps) {
  const { control, watch } = useFormContext<EditReceiptFormValues>();
  const { fields, append, remove } = useFieldArray<EditReceiptFormValues>({
    control,
    name: 'items',
  });

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

  return (
    <div className="flex flex-col space-y-4">
      <div className="font-semibold">Line Items</div>
      <ul className="grid gap-4 min-w-0">
        {fields?.map((item, index) => (
          <LineItem
            key={item.id}
            variant="edit"
            name={watch(`items.${index}.name`)}
            quantity={watch(`items.${index}.quantity`)}
            price={watch(`items.${index}.price`)}
            subcategory={
              subcategories?.find(
                (sub) => sub.id == watch(`items.${index}.subcategory_id`)
              )?.name
            }
            onRemoveClick={() => remove(index)}
            content={
              <>
                <FormField
                  control={control}
                  name={`items.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Item name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Item name"
                          // value={field.value || ''}
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`items.${index}.subcategory_id`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel htmlFor="subcategory">
                          Item category
                        </FormLabel>
                        <FormControl>
                          <Select
                            id="subcategory"
                            placeholder="Select Item Category"
                            items={selectItems}
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            disabled={!subcategories?.length}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="quantity">Quantity</FormLabel>
                      <FormControl>
                        <Input
                          id="quantity"
                          type="number"
                          inputMode="numeric"
                          value={field.value}
                          onChange={field.onChange}
                          min={1}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`items.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price">Price</FormLabel>
                      <FormControl>
                        <DollarInput
                          id="price"
                          value={field.value || ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            }
          />
        ))}
      </ul>
      <Button
        type="button"
        onClick={() =>
          append({
            name: 'Enter Item name',
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
