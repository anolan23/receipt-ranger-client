import { DatePicker } from '@/components/date-picker';
import { OptionItemDefinition } from '@/components/option';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/ui/combo-box';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMerchantSearch } from '@/hooks/use-merchant-search';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EditReceiptFormValues } from '../interfaces';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useCategories } from '@/hooks/use-categories';
import { Select } from '@/components/select';
import { DollarSign } from 'lucide-react';
import { DollarInput } from '@/components/dollar-input';

interface ReceiptInfoCardProps {}

export function ReceiptInfoCard({ ...props }: ReceiptInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  const [filterValue, setFilterValue] = useState<string>();
  const debouncedFilterValue = useDebouncedValue(filterValue, 300);

  const { data: merchants, isLoading: isMerchantSearchLoading } =
    useMerchantSearch(debouncedFilterValue);

  const { data: categories } = useCategories();

  const options = useMemo<Array<OptionItemDefinition>>(() => {
    if (!merchants?.length) return [];
    return merchants.map<OptionItemDefinition>((merch) => {
      return {
        label: merch.name,
        value: merch.id,
        imgSrc: merch.logo_url || undefined,
        description: merch.id,
      };
    });
  }, [merchants]);

  const categoryItems = useMemo(() => {
    return (
      categories?.map((cat) => {
        return {
          label: cat.label,
          value: cat.id.toString(),
        };
      }) || []
    );
  }, [categories]);

  return (
    <Card className="min-w-0">
      {/* <CardHeader>
        <CardTitle>Receipt Information</CardTitle>
      </CardHeader> */}
      <CardContent className="space-y-4 pt-6">
        <FormField
          control={form.control}
          name="merchantOption"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Merchant</FormLabel>
                <FormControl>
                  <Combobox
                    options={options}
                    selectedOption={field.value}
                    onOptionChange={field.onChange}
                    triggerVariant="option"
                    searchPlaceHolder="Search Merchants..."
                    empty="No Merchant found."
                    loading={isMerchantSearchLoading}
                    filterValue={filterValue}
                    onFilterChange={setFilterValue}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel htmlFor="category_id">Receipt Category</FormLabel>
                <FormControl>
                  <Select
                    id="category_id"
                    placeholder="Select Category"
                    items={categoryItems}
                    value={field.value}
                    onValueChange={(value) => {
                      if (value !== '') {
                        field.onChange(value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="transaction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transaction_date">Transaction Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  id="transaction_date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="subtotal">Subtotal</FormLabel>
              <FormControl>
                <DollarInput
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  id="subtotal"
                  type="number"
                  step={0.01}
                  min={0}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sales_tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="sales_tax">Sales Tax</FormLabel>
              <FormControl>
                <DollarInput
                  id="sales_tax"
                  type="number"
                  step={0.01}
                  min={0}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="total"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="total">Total</FormLabel>
              <FormControl>
                <DollarInput
                  id="total"
                  type="number"
                  step={0.01}
                  min={0}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
