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
import { MerchantData } from '@/lib/types';
import { useMemo } from 'react';
import { OptionItemDefinition } from '@/components/option';

interface MerchantInfoCardProps {
  merchants?: MerchantData[];
}

export function MerchantInfoCard({
  merchants,
  ...props
}: MerchantInfoCardProps) {
  const form = useFormContext<EditReceiptFormValues>();

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
        <CardTitle>Merchant Information</CardTitle>
        <CardDescription>
          Provides key details about the business associated with the receipt.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <FormField
          control={form.control}
          name="merchantOption"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel htmlFor="merchantOption">Merchant</FormLabel>
                <FormControl>
                  <Combobox
                    id="merchantOption"
                    options={options}
                    selectedOption={field.value}
                    onOptionChange={field.onChange}
                    triggerVariant="option"
                    searchPlaceHolder="Search Merchants..."
                    empty="No Merchant found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
