import { Camera } from 'lucide-react';
import { useState, DragEvent, ChangeEvent, useRef } from 'react';
import { cn } from '@/lib/utils';

interface UploadAreaProps {
  onFileProcessed: (files: FileList) => void;
}

/** Drop zone with a dashed `outline` border; it turns sage while you drag over it. */
export function UploadArea({ onFileProcessed }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileProcessed(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onFileProcessed(e.target.files);
    }
  }

  return (
    <label
      htmlFor="file-upload"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex w-full cursor-pointer flex-col items-center rounded-lg border-[2.5px] border-dashed border-outline p-6 text-ink transition-[background-color,transform] duration-[220ms] ease-bounce hover:scale-[1.01] hover:bg-blob-sage focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-focus sm:p-8',
        isDragOver ? 'scale-[1.01] bg-blob-sage' : 'bg-surface-100'
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-blob-butter">
          <Camera aria-hidden className="size-7" />
        </span>
        <div className="space-y-1">
          <h3 className="mt-3 font-display text-xl font-semibold">
            Scan a receipt
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Choose from photos or drag and drop here
          </p>
          <p className="text-sm text-ink-muted">
            Lay it flat and make sure the total is visible
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileSelect}
        className="sr-only"
      />
    </label>
  );
}
