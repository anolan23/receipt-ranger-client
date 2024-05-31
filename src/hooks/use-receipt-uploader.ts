import { useState } from 'react';
import { CreateReceiptResult, createReceipt } from '../lib/api/receipts';
import { UploadFile, UploadStatus } from '../lib/types';

class FileUploadError extends Error {
  constructor(public file: File, message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

interface UseReceiptUploaderOptions {
  onUploadSuccess?: (fileId: string) => void;
}

export function useReceiptUploader({
  onUploadSuccess,
}: UseReceiptUploaderOptions) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileUploadErrors, setFileUploadErrors] = useState<FileUploadError[]>(
    []
  );

  const addFileToUpload = function (file: File) {
    const id = file.name; //unique ID
    const uploadFile: UploadFile = {
      id,
      file,
      status: 'pending',
    };
    setUploadFiles((prevState) => [...prevState, uploadFile]);
    return id;
  };

  const removeFileFromUpload = function (id: string) {
    setUploadFiles((prevState) =>
      prevState.filter((uploadFile) => uploadFile.id !== id)
    );
  };

  const updateFileStatus = function (fileId: string, status: UploadStatus) {
    setUploadFiles((prevState) =>
      prevState.map((uploadFile) =>
        uploadFile.id === fileId ? { ...uploadFile, status } : uploadFile
      )
    );
  };

  const upload = async function (file: File) {
    const fileId = addFileToUpload(file);
    try {
      const result = await createReceipt(file);
      updateFileStatus(fileId, 'completed');
      onUploadSuccess && onUploadSuccess(fileId);

      return result;
    } catch (error) {
      updateFileStatus(fileId, 'failed');
      throw new FileUploadError(
        file,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const uploadAll = async function (fileList: FileList) {
    const promises = Array.from(fileList).map(upload);
    setUploading(true);
    const results = await Promise.allSettled(promises);
    setUploading(false);
    const failedUploads = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected'
      )
      .map((result) => result.reason as FileUploadError);

    const fulfilled = results
      .filter(
        (result): result is PromiseFulfilledResult<CreateReceiptResult> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value);

    setFileUploadErrors(failedUploads);
    return { failedUploads, fulfilled };
  };

  return {
    uploadFiles,
    uploadAll,
    errors: fileUploadErrors,
    uploading,
    removeFileFromUpload,
  };
}
