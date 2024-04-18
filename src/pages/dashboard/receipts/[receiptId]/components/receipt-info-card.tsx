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

interface ReceiptInfoCardProps {}

export function ReceiptInfoCard({ ...props }: ReceiptInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  return (
    <Card>
      {/* <CardHeader>
        <CardTitle>Receipt Metadata</CardTitle>
      </CardHeader> */}
      <CardContent className="pt-6">
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
      </CardContent>
    </Card>
  );
}
