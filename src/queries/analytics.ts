import {
  getCategoryTotals,
  getMerchantCounts,
  getOverview,
  getSpendingExplorer,
  getSpendingOverview,
  getSubcategoryTotals,
  getTopBaseItems,
} from '@/lib/api/analytics';
import { getMonthlyTotals } from '@/lib/api/receipts';
import {
  GetOverviewParams,
  SpendingExplorerParams,
  UseCategoryTotalsParams,
  UseMerchantCountsParams,
  UseMonthlyTotalsParams,
  UseTopBaseItemsParams,
} from '@/lib/types';
import { useQuery } from '@tanstack/react-query';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (params: GetOverviewParams) =>
    ['analytics', 'overview', params] as const,
  spendingOverview: ['analytics', 'spending-overview'] as const,
  spendingExplorer: (params: SpendingExplorerParams) =>
    ['analytics', 'spending-explorer', params] as const,
  categoryTotals: (params: UseCategoryTotalsParams) =>
    ['analytics', 'category-totals', params] as const,
  subcategoryTotals: (params: UseCategoryTotalsParams) =>
    ['analytics', 'subcategory-totals', params] as const,
  merchantCounts: (params: UseMerchantCountsParams) =>
    ['analytics', 'merchant-counts', params] as const,
  topBaseItems: (params?: UseTopBaseItemsParams) =>
    ['analytics', 'top-base-items', params] as const,
  monthlyTotals: (params: UseMonthlyTotalsParams) =>
    ['analytics', 'monthly-totals', params] as const,
};

export function useOverview(params: GetOverviewParams) {
  return useQuery({
    queryKey: analyticsKeys.overview(params),
    queryFn: () => getOverview(params),
  });
}

export function useSpendingOverview() {
  return useQuery({
    queryKey: analyticsKeys.spendingOverview,
    queryFn: getSpendingOverview,
  });
}

export function useSpendingExplorer(params: SpendingExplorerParams) {
  return useQuery({
    queryKey: analyticsKeys.spendingExplorer(params),
    queryFn: () => getSpendingExplorer(params),
  });
}

export function useCategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: analyticsKeys.categoryTotals(params),
    queryFn: () => getCategoryTotals(params),
  });
}

export function useSubcategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: analyticsKeys.subcategoryTotals(params),
    queryFn: () => getSubcategoryTotals(params),
  });
}

export function useMerchantCounts(params: UseMerchantCountsParams) {
  return useQuery({
    queryKey: analyticsKeys.merchantCounts(params),
    queryFn: () => getMerchantCounts(params),
  });
}

export function useTopBaseItems(params?: UseTopBaseItemsParams) {
  return useQuery({
    queryKey: analyticsKeys.topBaseItems(params),
    queryFn: () => getTopBaseItems(params),
  });
}

export function useMonthlyTotals(params: UseMonthlyTotalsParams) {
  return useQuery({
    queryKey: analyticsKeys.monthlyTotals(params),
    queryFn: () => getMonthlyTotals(params),
  });
}
