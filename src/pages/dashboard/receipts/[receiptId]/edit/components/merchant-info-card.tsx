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
import { Combobox } from '@/components/ui/combo-box';

interface MerchantInfoCardProps {}

export function MerchantInfoCard({ ...props }: MerchantInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant Information</CardTitle>
        <CardDescription>
          Provides key details about the business associated with the receipt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={form.control}
          name="merchant_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merchant</FormLabel>
              <FormControl>
                <Combobox value={field.value} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="merchant_logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <div className="w-[50px] h-[50px]">
                  <img className="w-full h-full rounded-sm" src={field.value} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
