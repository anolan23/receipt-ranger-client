import { Link } from '@/components/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

import UploadArea from '@/components/upload-area';
import { useReceiptUploader } from '@/hooks/use-receipt-uploader';
import { formatBytes } from '@/lib/helpers';
import { ReloadIcon, RocketIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/loader';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';

interface UploadPageProps {}

export function UploadPage({ ...props }: UploadPageProps) {
  const navigate = useNavigate();
  const { uploadFiles, uploadAll, errors } = useReceiptUploader();

  const handleFileDrop = async function (files: FileList) {
    const { failedUploads, fulfilled } = await uploadAll(files);
    failedUploads.forEach((failedUpload) => {
      const id = failedUpload.file.name + failedUpload.file.size;
      toast.error(`Failed to upload ${failedUpload.file.name}`, {
        id,
        description: failedUpload.message,
        action:
          failedUpload.message ===
          'Maximum number of receipt uploads reached' ? (
            <Button
              key={id}
              size="sm"
              onClick={() => toast.dismiss(id)}
              asChild
            >
              <Link to="/membership">
                <RocketIcon className="mr-2 w-4 h-4" />
                Try Pro
              </Link>
            </Button>
          ) : undefined,
      });
    });
  };
  return (
    <div className="max-w-[800px] space-y-4">
      <Header title="Upload receipts" />
      <Alert>
        <RocketIcon className="h-4 w-4" />
        <AlertTitle>Receipt upload via email now supported</AlertTitle>
        <AlertDescription>
          Quickly add receipts to your account by emailing receipt images
          directly from your phone to{' '}
          <Link to="mailto:uploader@snapceipt.com">uploader@snapceipt.com</Link>
          . No need to transfer files to your computer or log in.
        </AlertDescription>
      </Alert>
      {/* {!!errors.length && (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errors.map((error) => {
              return (
                <div>
                  Failed to upload {error.file.name}: {error.message}
                </div>
              );
            })}
          </AlertDescription>
        </Alert>
      )} */}
      <div className="space-y-4">
        <UploadArea onFileProcessed={handleFileDrop} />
        {uploadFiles.map((uploadFile, index) => {
          const url = URL.createObjectURL(uploadFile.file);
          return (
            <div
              key={uploadFile.id}
              className="flex items-center gap-4 border rounded-lg px-4 py-3"
            >
              <div className="w-[50px] h-[50px]">
                <img className="w-full h-full grayscale rounded-sm" src={url} />
              </div>
              <div>
                <div className="font-medium">{uploadFile.file.name}</div>
                <div className="text-muted-foreground text-xs">
                  {formatBytes(uploadFile.file.size)}
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-2">
                {uploadFile.status === 'processing' ||
                uploadFile.status === 'uploading' ? (
                  <Loader />
                ) : null}
                {uploadFile.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
