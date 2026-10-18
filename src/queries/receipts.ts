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
import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { queryKeys } from './keys';

export function useReceipts(params?: GetReceiptsParams) {
  return useQuery({
    queryKey: queryKeys.receipts.list(params).queryKey,
    queryFn: () => getReceipts(params),
  });
}

export function useReceipt(receiptId?: string) {
  return useQuery({
    queryKey: queryKeys.receipts.detail(receiptId).queryKey,
    queryFn: receiptId ? () => getReceipt(receiptId) : skipToken,
    retry: false,
  });
}

export function useReceiptItems(receiptId?: string) {
  return useQuery({
    queryKey: queryKeys.receipts.detail(receiptId)._ctx.items.queryKey,
    queryFn: receiptId ? () => getReceiptItems(receiptId) : skipToken,
  });
}

export function useScanUsage() {
  return useQuery({
    queryKey: queryKeys.receipts.usage.queryKey,
    queryFn: getScanUsage,
  });
}

/** Receipts feed every analytics view, so any receipt change invalidates both. */
function useInvalidateReceipts() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts._def }),
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics._def }),
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
