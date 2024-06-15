export type ReceiptData = {
  id: string;
  created_at: string;
  updated_at: string;
  object_key: string | null;
  merchant_id: string | null;
  merchant: MerchantData;
  subtotal: string | null;
  sales_tax: string | null;
  total_amount: string | null;
  transaction_date: string | null;
  user_id: number | null;
  ocr_text: string | null;
  items: ItemData[] | null;
  category_id: number | null;
  category: CategoryData | null;
  reviewed: boolean;
};

export type MerchantData = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  logo_url: string | null;
};

export type ItemData = {
  id: number;
  created_at: string;
  updated_at: string;
  receipt_id: string;
  subcategory: string | null;
  subcategory_id: number | null;
  generated_item_name: string | null;
  item_name_raw: string | null;
  price_per_unit: string | null;
  quantity: number | null;
  total_price: string | null;
  base_item_type: string | null;
};

export type CategoryData = {
  id: number;
  created_at: string;
  updated_at: string;
  label: string;
};

export type SubcategoryData = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  category_id: string;
};

export type GoalData = {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  amount: string;
};

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export type SubscriptionRecordData = {
  created_at: string;
  end_date: string;
  id: number;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  subscription_status: SubscriptionStatus;
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
  taskId?: string;
};

export type MonthySpendingData = {
  month_date: string;
  total: string;
};

export type CategoryTotalsResult = {
  category: string;
  total: string;
};
export type SubcategoryTotalsResult = {
  category: string;
  total: string;
};
export type TopBaseItemResult = {
  label: string | null;
  total: string;
  ratio: string;
};
export type MerchantCountsResult = {
  merchant: string;
  count: number;
};
export type SpendingOverviewResult = {
  current_month_spend: string;
  previous_month_spend: string;
  forecasted_spend: string;
  comparison: string;
  goal_budget: string | null;
  remaining_budget: string | null;
};
export type OverviewResult = {
  avg_receipt_total: string;
  total_amount: string;
  receipt_count: number;
};

export interface DateRange {
  start_date: string;
  end_date: string;
}

export interface SpendingExplorerParams extends DateRange {
  granularity: 'daily' | 'monthly';
  dimension?: 'category';
}
export interface GetOverviewParams extends DateRange {}

export interface SpendingExplorerParams extends DateRange {
  granularity: 'daily' | 'monthly';
  dimension?: 'category';
}

export interface UseCategoryTotalsParams extends DateRange {}
export interface UseTopBaseItemsParams extends DateRange {}
export interface UseMerchantCountsParams extends DateRange {}
export interface UseMonthlyTotalsParams extends DateRange {}

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

export type DatePreset =
  | '1-day'
  | '7-days'
  | 'mtd'
  | '1-month'
  | '3-months'
  | '6-months'
  | '1-year'
  | '3-years'
  | 'ytd';
