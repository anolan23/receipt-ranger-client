import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UploadArea from '@/components/upload-area';
import { useReceiptUploader } from '@/hooks/use-receipt-uploader';
import { formatBytes } from '@/lib/helpers';
import { ReaderIcon, ReloadIcon } from '@radix-ui/react-icons';

interface UploadPageProps {}

export function UploadPage({ ...props }: UploadPageProps) {
  const { uploadFiles, uploadAll } = useReceiptUploader();
  const handleFileDrop = function (files: FileList) {
    uploadAll(files);
  };
  return (
    <>
      <div className="flex items-center space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Upload receipts</h2>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadArea onFileProcessed={handleFileDrop} />
          {uploadFiles.map((uploadFile, index) => {
            return (
              <div>
                <div
                  key={uploadFile.id}
                  className="flex items-center py-4 px-6"
                >
                  <div>
                    <div>{uploadFile.file.name}</div>
                    <div className="text-muted-foreground">
                      {formatBytes(uploadFile.file.size)}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {uploadFile.status === 'processing' ||
                    uploadFile.status === 'uploading' ? (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {uploadFile.status}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
