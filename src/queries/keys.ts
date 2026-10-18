import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';
import {
  GetOverviewParams,
  SpendingExplorerParams,
  UseCategoryTotalsParams,
  UseMerchantCountsParams,
  UseMonthlyTotalsParams,
  UseTopBaseItemsParams,
} from '@/lib/types';
import { GetItemsParams } from '@/lib/api/items';
import { GetReceiptsParams } from '@/lib/api/receipts';

const analyticsKeys = createQueryKeys('analytics', {
  overview: (params: GetOverviewParams) => [params],
  spendingOverview: null,
  spendingExplorer: (params: SpendingExplorerParams) => [params],
  categoryTotals: (params: UseCategoryTotalsParams) => [params],
  subcategoryTotals: (params: UseCategoryTotalsParams) => [params],
  merchantCounts: (params: UseMerchantCountsParams) => [params],
  topBaseItems: (params?: UseTopBaseItemsParams) => [params],
  monthlyTotals: (params: UseMonthlyTotalsParams) => [params],
});

export type CategoryId = number | string;

const categoryKeys = createQueryKeys('categories', {
  list: null,
  detail: (categoryId?: CategoryId) => ({
    queryKey: [categoryId],
    contextQueries: { items: null, subcategories: null },
  }),
});

const goalKeys = createQueryKeys('goals', {
  current: null,
});

const itemKeys = createQueryKeys('items', {
  list: (params?: GetItemsParams) => [params],
  detail: (itemId?: number | string) => [itemId],
});

const merchantKeys = createQueryKeys('merchants', {
  list: null,
  search: (search?: string) => [search],
});

const receiptKeys = createQueryKeys('receipts', {
  list: (params?: GetReceiptsParams) => [params],
  detail: (receiptId?: string) => ({
    queryKey: [receiptId],
    contextQueries: { items: null },
  }),
  usage: null,
});

const subscriptionKeys = createQueryKeys('subscription', {
  current: null,
});

const userKeys = createQueryKeys('user', {
  attributes: null,
});

export const queryKeys = mergeQueryKeys(
  analyticsKeys,
  categoryKeys,
  goalKeys,
  itemKeys,
  merchantKeys,
  receiptKeys,
  subscriptionKeys,
  userKeys
);
