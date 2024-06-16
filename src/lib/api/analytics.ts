import { backend } from '../backend';
import {
  CategoryTotalsResult,
  DateInterval,
  GetOverviewParams,
  MerchantCountsResult,
  OverviewResult,
  SpendingExplorerParams,
  SpendingExplorerResult,
  SpendingOverviewResult,
  SubcategoryTotalsResult,
  TopBaseItemResult,
  UseCategoryTotalsParams,
  UseMerchantCountsParams,
  UseTopBaseItemsParams,
} from '../types';

export async function getOverview(params: GetOverviewParams) {
  const response = await backend.get<OverviewResult>('/analytics/overview', {
    params,
  });
  return response.data;
}

export async function getSpendingOverview() {
  const response = await backend.get<SpendingOverviewResult>(
    '/analytics/spending-overview'
  );
  return response.data;
}

export async function getSpendingExplorer(params: SpendingExplorerParams) {
  const response = await backend.get<SpendingExplorerResult[]>(
    '/analytics/spending-explorer',
    { params }
  );
  return response.data;
}

export async function getCategoryTotals(params: UseCategoryTotalsParams) {
  const response = await backend.get<CategoryTotalsResult[]>(
    '/analytics/category-totals',
    { params }
  );
  return response.data;
}
export async function getMerchantCounts(params: UseMerchantCountsParams) {
  const response = await backend.get<MerchantCountsResult[]>(
    '/analytics/merchant-counts',
    { params }
  );
  return response.data;
}

export async function getSubcategoryTotals(params: UseCategoryTotalsParams) {
  const response = await backend.get<SubcategoryTotalsResult[]>(
    '/analytics/subcategory-totals',
    { params }
  );
  return response.data;
}

export async function getTopBaseItems(params?: UseTopBaseItemsParams) {
  const response = await backend.get<TopBaseItemResult[]>(
    '/analytics/top-base-items',
    { params }
  );
  return response.data;
}
