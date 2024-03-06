export type ReceiptData = {
  id: number;
  created_at: string;
  updated_at: string;
  object_key: string | null;
  store_name: string | null;
  total_amount: string | null;
  transaction_date: string | null;
  user_id: number | null;
};

export type ItemData = {
  id: number;
  created_at: string;
  updated_at: string;
  receipt_id: number;
  category: string | null;
  category_id: number | null;
  generated_item_name: string | null;
  item_name_raw: string | null;
  price_per_unit: string | null;
  quantity: number | null;
  total_price: string | null;
};

export type UploadFileStatus =
  | 'uploading'
  | 'processing'
  | 'complete'
  | 'error';

export type UploadFile = {
  id: string;
  file: File;
  status: UploadFileStatus;
};
