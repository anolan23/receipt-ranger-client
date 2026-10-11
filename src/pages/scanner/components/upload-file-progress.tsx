import { StatusIndicator } from '@/components/status-indicator';
import { UploadFile } from '@/lib/types';

interface FileProgressProps {
  uploadFile: UploadFile;
}

export function UploadFileProgress({ uploadFile }: FileProgressProps) {
  return (
    <StatusIndicator status="loading">{uploadFile.file.name}</StatusIndicator>
  );
}
