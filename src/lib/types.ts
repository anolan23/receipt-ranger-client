export type ReceiptData = {
  id: number;
  created_at: string;
  updated_at: string;
  object_key: string | null;
  merchant_id: string | null;
  merchant: MerchantData;
  total_amount: string | null;
  transaction_date: string | null;
  user_id: number | null;
  ocr_text: string | null;
};

type MerchantData = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  logo_url: string | null;
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

export type GoalData = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  amount: string;
};

export type SubscriptionRecordData = {
  created_at: string;
  end_date: string;
  id: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  subscription_status: string;
  updated_at: string;
  user_id: string;
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

export type MonthySpendingData = {
  iso_date: string;
  month_name: string;
  total: string;
  year: number;
};

export type SpendingOverviewResult = {
  current_month_spend: string;
  forecasted_spend: string;
  comparison: string;
  goal_budget: string | null;
  remaining_budget: string | null;
};

export interface SpendingExplorerParams {
  start_date: string;
  end_date: string;
  granularity: 'daily' | 'monthly';
  dimension?: 'category';
}

export type SpendingExplorerResultBase = {
  date: string;
  total_spent: string;
};
export type SpendingExplorerCategoryResult = {
  category: string;
} & SpendingExplorerResultBase;
export type SpendingExplorerResult =
  | SpendingExplorerResultBase
  | SpendingExplorerCategoryResult;

export type Credentials = {
  email: string;
  password: string;
};

export type Theme = 'dark' | 'light' | 'system';
