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
  merchant_logo_url: string;
  merchant_name: string;
  payment_card_number: string;
}
