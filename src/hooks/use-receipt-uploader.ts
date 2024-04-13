import { useState } from 'react';
import { uploadFile } from '../lib/api/files';
import { createReceipt } from '../lib/api/receipts';
import { UploadFile, UploadFileStatus } from '../lib/types';

class FileUploadError extends Error {
  constructor(public file: File, message: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export function useReceiptUploader() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [fileUploadErrors, setFileUploadErrors] = useState<FileUploadError[]>(
    []
  );

  const addFileToUpload = function (file: File) {
    const id = file.name; //unique ID
    const uploadFile: UploadFile = {
      id,
      file,
      status: 'uploading',
    };
    setUploadFiles((prevState) => [...prevState, uploadFile]);
    return id;
  };

  const updateFileStatus = function (
    fileId: string,
    newStatus: UploadFileStatus
  ) {
    setUploadFiles((prevState) =>
      prevState.map((uploadFile) =>
        uploadFile.id === fileId
          ? { ...uploadFile, status: newStatus }
          : uploadFile
      )
    );
  };

  const upload = async function (file: File) {
    const fileId = addFileToUpload(file);
    try {
      updateFileStatus(fileId, 'processing');
      const result = await createReceipt(file);
      updateFileStatus(fileId, 'complete');
      return result;
    } catch (error) {
      updateFileStatus(fileId, 'error');
      throw new FileUploadError(
        file,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const uploadAll = async function (fileList: FileList) {
    const promises = Array.from(fileList).map(upload);
    const results = await Promise.allSettled(promises);

    const failedUploads = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === 'rejected'
      )
      .map((result) => result.reason as FileUploadError);

    const fulfilled = results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value);

    setFileUploadErrors(failedUploads);
    return { failedUploads, fulfilled };
  };

  return { uploadFiles, uploadAll, errors: fileUploadErrors };
}
