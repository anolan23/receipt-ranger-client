import { UploadIcon } from '@radix-ui/react-icons';
import { useState, DragEvent, useRef } from 'react';
import { Button } from './ui/button';

interface UploadAreaProps {
  onFileProcessed: (files: FileList) => void;
}

export function UploadArea({ onFileProcessed }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileProcessed(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }

  function processFiles(files: FileList) {
    onFileProcessed(files);
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex flex-col space-y-3 p-8 shrink-0 items-center justify-center rounded-md border border-dashed"
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <UploadIcon height={24} width={24} />
        <h3 className="mt-4 text-lg font-semibold">Drag & drop</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Image filetypes supported (png, jpg, bmp, tiff, webp). Max 5MB.
        </p>
        <Button size="sm" onClick={handleClick}>
          Add receipt
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/gif, image/webp"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          hidden
        />
      </div>
    </div>
  );
}

export default UploadArea;
