import { UploadIcon } from '@radix-ui/react-icons';
import { CloudUpload } from 'lucide-react';
import { useState, DragEvent, ChangeEvent, useRef } from 'react';

interface UploadAreaProps {
  onFileProcessed: (files: FileList) => void;
}

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
      className={`flex w-full flex-col items-center rounded-md bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-8 border-2 border-dashed cursor-pointer ${
        isDragOver ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div>
          <CloudUpload size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="mt-2 font-semibold">Upload from computer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Select files or drag and drop
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
