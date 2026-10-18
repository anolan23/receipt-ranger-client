import { UploadFile } from '@/lib/types';
import { FileText } from 'lucide-react';
import { StatusIndicator } from '@/components/status-indicator';

interface FileProgressProps {
  uploadFile: UploadFile;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** One thumbnail in the batch tray: file name, size and a "reading" status pill. */
export function UploadFileProgress({ uploadFile }: FileProgressProps) {
  const { file } = uploadFile;
  return (
    <div className="flex w-full min-w-0 items-center gap-3 rounded-md border border-line bg-surface-raised p-3">
      <div className="grid h-12 w-10 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-outline bg-[#fffdf8] text-[#755d56]">
        <FileText aria-hidden className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold">{file.name}</div>
        <div className="num text-[13px] text-ink-muted">
          {formatSize(file.size)}
        </div>
      </div>
      <StatusIndicator status="loading">Reading…</StatusIndicator>
    </div>
  );
}
