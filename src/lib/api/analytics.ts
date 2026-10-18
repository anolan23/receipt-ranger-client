import { supabase } from '../supabase';
import { money } from './mappers';
import {
  CategoryTotalsResult,
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

const range = (params?: { start_date: string; end_date: string }) => ({
  p_start_date: params?.start_date,
  p_end_date: params?.end_date,
});

function unwrap<T>({
  data,
  error,
}: {
  data: T | null;
  error: { message: string } | null;
}): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export async function getOverview(params: GetOverviewParams) {
  const [row] = unwrap(
    await supabase.rpc('analytics_overview', range(params))
  );
  return {
    total_amount: money(row.total_amount),
    avg_receipt_total: money(row.avg_receipt_total),
    receipt_count: Number(row.receipt_count),
  } as OverviewResult;
}

export async function getSpendingOverview() {
  const [row] = unwrap(await supabase.rpc('analytics_spending_overview'));
  return {
    current_month_spend: money(row.current_month_spend),
    previous_month_spend: money(row.previous_month_spend),
    forecasted_spend: money(row.forecasted_spend),
    comparison: money(row.comparison),
    goal_budget: money(row.goal_budget),
    remaining_budget: money(row.remaining_budget),
  } as SpendingOverviewResult;
}

export async function getSpendingExplorer(params: SpendingExplorerParams) {
  const rows = unwrap(
    await supabase.rpc('analytics_spending_explorer', {
      p_start_date: params.start_date,
      p_end_date: params.end_date,
      p_granularity: params.granularity,
      p_dimension: params.dimension,
    })
  );
  return rows.map(
    (row): SpendingExplorerResult => ({
      date: row.date,
      total_spent: String(row.total_spent),
      ...(row.category ? { category: row.category } : {}),
    })
  );
}

export async function getCategoryTotals(params: UseCategoryTotalsParams) {
  const rows = unwrap(
    await supabase.rpc('analytics_category_totals', range(params))
  );
  return rows.map(
    (row): CategoryTotalsResult => ({
      category: row.category,
      total: String(row.total),
    })
  );
}

export async function getMerchantCounts(params: UseMerchantCountsParams) {
  const rows = unwrap(
    await supabase.rpc('analytics_merchant_counts', range(params))
  );
  return rows.map(
    (row): MerchantCountsResult => ({
      merchant: row.merchant,
      count: Number(row.count),
    })
  );
}

export async function getSubcategoryTotals(params: UseCategoryTotalsParams) {
  const rows = unwrap(
    await supabase.rpc('analytics_subcategory_totals', range(params))
  );
  return rows.map(
    (row): SubcategoryTotalsResult => ({
      category: row.category,
      total: String(row.total),
    })
  );
}

export async function getTopBaseItems(params?: UseTopBaseItemsParams) {
  const rows = unwrap(
    await supabase.rpc('analytics_top_base_items', range(params))
  );
  return rows.map(
    (row): TopBaseItemResult => ({
      label: row.label,
      total: String(row.total),
      ratio: String(row.ratio),
    })
  );
}
