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

interface PaymentInfoCardProps {}

export function PaymentInfoCard({ ...props }: PaymentInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="payment_card_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="payment_card_number">Credit Card</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select card"
                  items={[
                    { label: 'xxx', value: '1' },
                    { label: 'xxx', value: '2' },
                  ]}
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
