import { useState } from 'react';
import { uploadFile } from '../lib/api/files';
import { createReceipt } from '../lib/api/receipts';
import { UploadFile, UploadFileStatus } from '../lib/types';

export function useReceiptUploader() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

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
      prevState.map((file) =>
        file.id === fileId ? { ...file, status: newStatus } : file
      )
    );
  };

  const upload = async function (file: File) {
    const fileId = addFileToUpload(file);
    try {
      const uploadResult = await uploadFile(file);
      updateFileStatus(fileId, 'processing');
      const createResult = await createReceipt(uploadResult.key);
      updateFileStatus(fileId, 'complete');
    } catch (error) {
      console.error(error);
      updateFileStatus(fileId, 'error');
    }
  };

  const uploadAll = async function (fileList: FileList) {
    const promises = Array.from(fileList).map(upload);
    const results = await Promise.allSettled(promises);
  };

  return { uploadFiles, uploadAll };
}
