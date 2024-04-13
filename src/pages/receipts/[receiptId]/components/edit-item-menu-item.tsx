import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSWRConfig } from 'swr';
import { ReloadIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';

import { Select } from '@/components/select';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateItem } from '@/lib/api/items';
import { ItemData } from '@/lib/types';

interface EditItemMenuItemProps {
  item: ItemData;
}

interface FormValues {
  generated_item_name: string;
  category_id?: number;
  quantity: number;
  discount: string;
  price_per_unit: string;
  total_price: string;
}

export function EditItemMenuItem({ item, ...props }: EditItemMenuItemProps) {
  const [open, setOpen] = useState(false);
  const defaultValues = useMemo<FormValues>(() => {
    return {
      generated_item_name: item.generated_item_name || '',
      category_id: item.category_id || undefined,
      quantity: item.quantity || 1,
      discount: '',
      price_per_unit: item.price_per_unit || '',
      total_price: item.total_price || '',
    };
  }, [item]);
  const form = useForm<FormValues>({
    defaultValues,
  });

  const { mutate } = useSWRConfig();

  async function onSubmit(values: FormValues) {
    try {
      const { discount, ...updates } = values;
      const result = await updateItem(item.id, updates);
      const key = `/receipts/${item.receipt_id}/items`;
      await mutate(key);
      toast('Line item updated');
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setOpen(false);
    }
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit item
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <Form {...form}>
          <form
            id="edit-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-2xl"
          >
            <DrawerHeader>
              <DrawerTitle>Edit line item</DrawerTitle>
              <DrawerDescription hidden>
                Edit a line item on the receipt
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="generated_item_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => {
                  const { value, ...rest } = field;
                  return (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Select category"
                          items={[
                            { label: 'Meat', value: 'meat' },
                            { label: 'Vegetables', value: 'veggies' },
                            { label: 'Condiments', value: 'cond' },
                          ]}
                          value={value?.toString()}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...form.register('quantity')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter per unit price"
                    min={0}
                    step={0.01}
                    {...form.register('price_per_unit')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    min={0}
                    step={0.01}
                    {...form.register('discount', { valueAsNumber: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter total price"
                    min={0}
                    step={0.01}
                    {...form.register('total_price')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <DrawerFooter>
              <Button type="submit" form="edit-form">
                {form.formState.isSubmitting && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
