import { backend } from '../backend';
import {
  SpendingExplorerParams,
  SpendingExplorerResult,
  SpendingOverviewResult,
} from '../types';

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
