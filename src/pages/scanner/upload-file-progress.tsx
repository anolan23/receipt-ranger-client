import { ImageLogo } from '@/components/image-logo';
import {
  StatusIndicator,
  StatusIndicatorStatus,
} from '@/components/status-indicator';
import { useReceiptTask } from '@/hooks/use-receipt-task';
import { ReceiptTaskResult } from '@/lib/api/receipts';
import { UploadFile } from '@/lib/types';

interface FileProgressProps {
  uploadFile: UploadFile;
  onUploadSuccess?: (result: ReceiptTaskResult | undefined) => void;
}

export function UploadFileProgress({
  uploadFile,
  onUploadSuccess,
  ...props
}: FileProgressProps) {
  const { data, error, isLoading } = useReceiptTask(
    uploadFile.taskId,
    onUploadSuccess
  );

  const getStatusIndicatorStatus = function (
    result?: ReceiptTaskResult
  ): StatusIndicatorStatus {
    if (error) return 'destructive';
    if (isLoading) return 'loading';
    if (result?.successful) return 'success';
    return 'loading';
  };
  return (
    <StatusIndicator status={getStatusIndicatorStatus(data)}>
      {uploadFile.file.name}
    </StatusIndicator>
  );
}
