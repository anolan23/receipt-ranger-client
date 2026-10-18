import { CategoryData, ItemData, MerchantData, ReceiptData } from '../types';

// PostgREST returns numeric columns as JSON numbers; the app's types (inherited from the
// Flask API) carry money as fixed-point strings, so convert at the boundary.
export const money = (value: number | string | null | undefined) =>
  value === null || value === undefined ? null : Number(value).toFixed(2);

type ItemRow = Omit<ItemData, 'subcategory' | 'price_per_unit' | 'total_price'> & {
  price_per_unit: number | null;
  total_price: number | null;
  subcategory: { name: string } | null;
};

export function toItem(row: ItemRow): ItemData {
  return {
    ...row,
    subcategory: row.subcategory?.name ?? null,
    price_per_unit: money(row.price_per_unit),
    total_price: money(row.total_price),
  };
}

type ReceiptRow = Omit<
  ReceiptData,
  'items' | 'subtotal' | 'sales_tax' | 'total_amount' | 'merchant' | 'category' | 'user_id'
> & {
  subtotal: number | null;
  sales_tax: number | null;
  total_amount: number | null;
  user_id: string;
  merchant: MerchantData | null;
  category: CategoryData | null;
  items: ItemRow[] | null;
};

export function toReceipt(row: ReceiptRow): ReceiptData {
  return {
    ...row,
    user_id: row.user_id as unknown as number | null,
    subtotal: money(row.subtotal),
    sales_tax: money(row.sales_tax),
    total_amount: money(row.total_amount),
    // Receipts without a merchant (a failed parse) still need an object for the UI.
    merchant: row.merchant ?? ({ name: '', logo_url: null } as MerchantData),
    items: row.items?.map(toItem) ?? null,
  };
}

export const RECEIPT_SELECT =
  '*, merchant:merchants(*), category:categories(*), items(*, subcategory:subcategories(name))';
export const ITEM_SELECT = '*, subcategory:subcategories(name)';
