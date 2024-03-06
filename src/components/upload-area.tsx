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
      <UploadIcon height={24} width={24} />
      <div>PNG, JPEG, GIF filetypes supported. Max 5MB.</div>
      <Button onClick={handleClick}>Choose files</Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg, image/png, image/gif"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        hidden
      />
    </div>
  );
}

export default UploadArea;
