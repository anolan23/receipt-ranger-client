import { DatePicker } from '@/components/date-picker';
import { OptionItemDefinition } from '@/components/option';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { AlertTriangle } from 'lucide-react';
import { DollarInput } from '@/components/dollar-input';
import { LineItemsTable } from './line-items-table';
import { Separator } from '@/components/ui/separator';
import { ReceiptData, SubcategoryData } from '@/lib/types';
import { getFileUrl, toDollar } from '@/lib/helpers';
import dayjs from 'dayjs';
import { LineItem } from '@/components/line-item';
import { LineItems } from './line-items';
import { useDeviceWidth } from '@/hooks/use-device-width';

interface ReceiptInfoCardProps {
  receipt: ReceiptData;
  subcategories?: SubcategoryData[];
}

export function ReceiptInfoCard({
  receipt,
  subcategories,
  ...props
}: ReceiptInfoCardProps) {
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
        imgSrc: merch.logo_url ? getFileUrl(merch.logo_url) : undefined,
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

  const [items, subtotal, salesTax, total] = form.watch([
    'items',
    'subtotal',
    'sales_tax',
    'total',
  ]);
  const mismatches = useMemo(() => {
    const out: string[] = [];
    const num = (v: unknown) => (v === '' || v == null ? NaN : Number(v));
    const itemSum = (items ?? []).reduce(
      (sum, i) => sum + (i.price ? Number(i.price) : 0),
      0,
    );
    if (items?.length && Math.abs(itemSum - num(subtotal)) > 0.01) {
      out.push(`Items add up to $${itemSum.toFixed(2)}, not the subtotal.`);
    }
    const expected = num(subtotal) + num(salesTax);
    if (!Number.isNaN(expected) && Math.abs(expected - num(total)) > 0.01) {
      out.push(`Subtotal + tax is $${expected.toFixed(2)}, not the total.`);
    }
    return out;
  }, [items, subtotal, salesTax, total]);

  const modifiedDateShort = dayjs(receipt.created_at).format('YYYY-MM-DD');
  const modifiedDate = dayjs(receipt.created_at).fromNow();

  return (
    <Card className="min-w-0 bg-card sm:shadow sm:border">
      <CardContent className="px-4 pt-4 space-y-4 sm:p-6 sm:pt-6">
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
          name="transaction_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transaction_date">Transaction Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  id="transaction_date"
                  className="max-w-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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

        <Separator />
        <LineItems receipt={receipt} subcategories={subcategories} />
        <Separator />
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="subtotal"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_9rem] items-center gap-x-4 space-y-0">
                <FormLabel htmlFor="subtotal">Subtotal</FormLabel>
                <div>
                  <FormControl>
                    <DollarInput
                      id="subtotal"
                      type="number"
                      step={0.01}
                      min={0}
                      {...field}
                      className="text-right tabular-nums"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sales_tax"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_9rem] items-center gap-x-4 space-y-0">
                <FormLabel htmlFor="sales_tax">Sales Tax</FormLabel>
                <div>
                  <FormControl>
                    <DollarInput
                      id="sales_tax"
                      type="number"
                      step={0.01}
                      min={0}
                      {...field}
                      className="text-right tabular-nums"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem className="grid grid-cols-[1fr_9rem] items-center gap-x-4 space-y-0">
                <FormLabel htmlFor="total" className="text-base font-semibold">
                  Total
                </FormLabel>
                <div>
                  <FormControl>
                    <DollarInput
                      id="total"
                      type="number"
                      step={0.01}
                      min={0}
                      {...field}
                      className="text-right tabular-nums font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {mismatches.map((m) => (
            <p
              key={m}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              {m}
            </p>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Scanned <time dateTime={modifiedDateShort}>{modifiedDate}</time>
        </div>
      </CardFooter>
    </Card>
  );
}
