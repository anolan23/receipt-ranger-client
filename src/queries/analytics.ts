import { queryKeys } from './keys';
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

export function useOverview(params: GetOverviewParams) {
  return useQuery({
    queryKey: queryKeys.analytics.overview(params).queryKey,
    queryFn: () => getOverview(params),
  });
}

export function useSpendingOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.spendingOverview.queryKey,
    queryFn: getSpendingOverview,
  });
}

export function useSpendingExplorer(params: SpendingExplorerParams) {
  return useQuery({
    queryKey: queryKeys.analytics.spendingExplorer(params).queryKey,
    queryFn: () => getSpendingExplorer(params),
  });
}

export function useCategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.categoryTotals(params).queryKey,
    queryFn: () => getCategoryTotals(params),
  });
}

export function useSubcategoryTotals(params: UseCategoryTotalsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.subcategoryTotals(params).queryKey,
    queryFn: () => getSubcategoryTotals(params),
  });
}

export function useMerchantCounts(params: UseMerchantCountsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.merchantCounts(params).queryKey,
    queryFn: () => getMerchantCounts(params),
  });
}

export function useTopBaseItems(params?: UseTopBaseItemsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.topBaseItems(params).queryKey,
    queryFn: () => getTopBaseItems(params),
  });
}

export function useMonthlyTotals(params: UseMonthlyTotalsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.monthlyTotals(params).queryKey,
    queryFn: () => getMonthlyTotals(params),
  });
}
