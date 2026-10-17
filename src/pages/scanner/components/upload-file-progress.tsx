import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from '@/components/ui/attachment';
import { UploadFile } from '@/lib/types';
import { FileText, Loader2 } from 'lucide-react';

interface FileProgressProps {
  uploadFile: UploadFile;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadFileProgress({ uploadFile }: FileProgressProps) {
  const { file } = uploadFile;
  return (
    <Attachment state="processing" className="w-full">
      <AttachmentMedia>
        <FileText />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>
          Processing · {formatSize(file.size)}
        </AttachmentDescription>
      </AttachmentContent>
      <Loader2 className="mr-1 size-4 animate-spin text-muted-foreground" />
    </Attachment>
  );
}
