import { Select } from '@/components/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { EditReceiptFormValues } from '../interfaces';

interface StatusCardProps {}

export function StatusCard({ ...props }: StatusCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Receipt Status</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="receipt_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="transaction_date">Status</FormLabel>
              <FormControl>
                <Select
                  items={[
                    {
                      label: 'Reviewed',
                      value: '1',
                    },
                    {
                      label: 'Needs Review',
                      value: '2',
                    },
                  ]}
                  placeholder="Select status"
                  value={field.value}
                  onValueChange={field.onChange}
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
