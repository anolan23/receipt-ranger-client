import { OptionItemDefinition } from '@/components/option';

export type ItemUpdatePayload = {
  name: string;
  item_id?: number;
  subcategory_id?: number;
  quantity?: number;
  price?: string;
};

export interface EditReceiptFormValues {
  items: ItemUpdatePayload[];
  transaction_date?: Date;
  category_id: string;
  merchantOption?: OptionItemDefinition;
  subtotal: string;
  sales_tax: string;
  total: string;
}
