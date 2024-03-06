import { backend } from '../backend';

type ImageData = {
  name: string;
  type: string;
};
type UploadFileResult = {
  key: string;
};
export async function uploadFile(imageData: ImageData) {
  const formData = new FormData();
  formData.append('file', imageData as unknown as Blob);
  const response = await backend.post<UploadFileResult>('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: (d) => d,
  });
  return response.data;
}
