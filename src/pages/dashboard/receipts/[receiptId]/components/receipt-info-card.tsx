import { DatePicker } from '@/components/date-picker';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { EditReceiptFormValues } from '../interfaces';
import { Input } from '@/components/ui/input';

interface ReceiptInfoCardProps {}

export function ReceiptInfoCard({ ...props }: ReceiptInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Receipt Metadata</CardTitle>
      </CardHeader> */}
      <CardContent className="pt-6 space-y-2">
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
