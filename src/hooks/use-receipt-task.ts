import { useToast } from '@/components/ui/use-toast';
import { ReceiptTaskResult, pollReceiptTask } from '@/lib/api/receipts';
import useSWR from 'swr';

export function useReceiptTask(
  taskId?: string,
  onSuccess?: (result: ReceiptTaskResult | undefined) => void
) {
  const { toast } = useToast();
  return useSWR(
    taskId ? `/receipts/tasks/${taskId}/status` : null,
    async (url) => {
      if (!taskId) return;
      const result = await pollReceiptTask(taskId);
      if (result.ready && !result.successful) {
        throw new Error('Create receipt task was not successful');
      }
      return result;
    },
    {
      refreshInterval: (data) => {
        if (data && (data.successful || (data.ready && !data.successful))) {
          return 0; // Stop polling if the task is completed or ready
        }
        return 5000; // Poll every 5 seconds if the task is still in progress
      },
      onError: (error) => {
        console.error(error);
      },

      onSuccess: (result) => {
        if (result?.successful) {
          onSuccess && onSuccess(result);
          toast({
            variant: 'default',
            title: `Receipt created`,
            description:
              'The receipt details have been stored for your records.',
          });
        }
      },
      shouldRetryOnError: false,
    }
  );
}
