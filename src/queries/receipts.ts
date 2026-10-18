import {
  GetReceiptsParams,
  ReceiptUpdatePayload,
  createReceipt,
  deleteReceipt,
  getReceipt,
  getReceiptItems,
  getReceipts,
  getScanUsage,
  updateReceipt,
  updateReceiptReviewStatus,
} from '@/lib/api/receipts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsKeys } from './analytics';

export const receiptKeys = {
  all: ['receipts'] as const,
  list: (params?: GetReceiptsParams) => ['receipts', 'list', params] as const,
  detail: (id?: string) => ['receipts', id] as const,
  items: (id?: string) => ['receipts', id, 'items'] as const,
  usage: ['receipts', 'usage'] as const,
};

export function useReceipts(params?: GetReceiptsParams) {
  return useQuery({
    queryKey: receiptKeys.list(params),
    queryFn: () => getReceipts(params),
  });
}

export function useReceipt(receiptId?: string) {
  return useQuery({
    queryKey: receiptKeys.detail(receiptId),
    queryFn: () => getReceipt(receiptId!),
    enabled: !!receiptId,
    retry: false,
  });
}

export function useReceiptItems(receiptId?: string) {
  return useQuery({
    queryKey: receiptKeys.items(receiptId),
    queryFn: () => getReceiptItems(receiptId!),
    enabled: !!receiptId,
    retry: false,
  });
}

export function useScanUsage() {
  return useQuery({ queryKey: receiptKeys.usage, queryFn: getScanUsage });
}

/** Receipts feed every analytics view, so any receipt change invalidates both. */
function useInvalidateReceipts() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: receiptKeys.all }),
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all }),
    ]);
}

export function useCreateReceipt() {
  const invalidate = useInvalidateReceipts();
  return useMutation({
    mutationFn: createReceipt,
    onSuccess: invalidate,
  });
}

export function useUpdateReceipt() {
  const invalidate = useInvalidateReceipts();
  return useMutation({
    mutationFn: ({
      receiptId,
      updates,
    }: {
      receiptId: string;
      updates: ReceiptUpdatePayload;
    }) => updateReceipt(receiptId, updates),
    onSuccess: invalidate,
  });
}

export function useUpdateReceiptReviewStatus() {
  const invalidate = useInvalidateReceipts();
  return useMutation({
    mutationFn: ({
      receiptId,
      reviewed,
    }: {
      receiptId: string;
      reviewed: boolean;
    }) => updateReceiptReviewStatus(receiptId, reviewed),
    onSuccess: invalidate,
  });
}

export function useDeleteReceipt() {
  const invalidate = useInvalidateReceipts();
  return useMutation({
    mutationFn: deleteReceipt,
    onSuccess: invalidate,
  });
}
