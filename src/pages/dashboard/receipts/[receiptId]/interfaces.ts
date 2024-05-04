import { OptionItemDefinition } from '@/components/option';
import { MerchantData } from '@/lib/types';

export type ItemUpdatePayload = {
  name: string;
  item_id?: number;
  category_id?: number;
  quantity?: number;
  price?: string;
};

export interface EditReceiptFormValues {
  receipt_status: string;
  items: ItemUpdatePayload[];
  transaction_date?: Date;
  merchantOption?: OptionItemDefinition;
  payment_card_number: string;
  subtotal: string;
  sales_tax: string;
  total: string;
}
