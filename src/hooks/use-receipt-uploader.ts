import { useState } from 'react';
import { uploadFile } from '../lib/api/files';
import { CreateReceiptResult, createReceipt } from '../lib/api/receipts';
import { UploadFile } from '../lib/types';

class FileUploadError extends Error {
  constructor(public file: File, message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export function useReceiptUploader() {
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
    };
    setUploadFiles((prevState) => [...prevState, uploadFile]);
    return id;
  };

  const removeFileFromUpload = function (id: string) {
    setUploadFiles((prevState) =>
      prevState.filter((uploadFile) => uploadFile.id !== id)
    );
  };

  const updateFileTaskId = function (fileId: string, taskId: string) {
    setUploadFiles((prevState) =>
      prevState.map((uploadFile) =>
        uploadFile.id === fileId
          ? { ...uploadFile, taskId: taskId }
          : uploadFile
      )
    );
  };

  const upload = async function (file: File) {
    const fileId = addFileToUpload(file);
    try {
      const result = await createReceipt(file);
      updateFileTaskId(fileId, result.task_id);
      return result;
    } catch (error) {
      removeFileFromUpload(fileId);
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
