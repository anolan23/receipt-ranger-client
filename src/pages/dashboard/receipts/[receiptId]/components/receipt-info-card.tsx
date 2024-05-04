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

interface ReceiptInfoCardProps {}

export function ReceiptInfoCard({ ...props }: ReceiptInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  const [filterValue, setFilterValue] = useState('');
  const { data: merchants, isLoading: isMerchantSearchLoading } =
    useMerchantSearch(filterValue);

  const options = useMemo<Array<OptionItemDefinition>>(() => {
    if (!merchants?.length) return [];
    return merchants.map<OptionItemDefinition>((merch) => {
      return {
        label: merch.name,
        value: merch.name,
        imgSrc: merch.logo_url || undefined,
        description: merch.id,
      };
    });
  }, [merchants]);
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Receipt Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                    filterValue={filterValue}
                    loading={isMerchantSearchLoading}
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
                <Input
                  id="subtotal"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  step={0.01}
                  min={0}
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
                <Input
                  id="sales_tax"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  step={0.01}
                  min={0}
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
                <Input
                  id="total"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  step={0.01}
                  min={0}
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
