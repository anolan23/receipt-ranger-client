import {
  StatusIndicator,
  StatusIndicatorStatus,
} from '@/components/status-indicator';

import { UploadFile, UploadStatus } from '@/lib/types';

interface FileProgressProps {
  uploadFile: UploadFile;
}

export function UploadFileProgress({
  uploadFile,
  ...props
}: FileProgressProps) {
  const getStatusIndicatorStatus = function (
    status?: UploadStatus
  ): StatusIndicatorStatus {
    if (status === 'failed') return 'destructive';
    if (status === 'pending') return 'loading';
    if (status === 'completed') return 'success';
    return 'loading';
  };
  return (
    <StatusIndicator status={getStatusIndicatorStatus(uploadFile.status)}>
      {uploadFile.file.name}
    </StatusIndicator>
  );
}
