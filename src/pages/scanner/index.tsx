import CopyableText from '@/components/copyable-text';
import { Header } from '@/components/header';
import { Link } from '@/components/link';

import { Loader } from '@/components/loader';
import { ReceiptsTable } from '@/components/receipts-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import UploadArea from '@/components/upload-area';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { useReceiptUploader } from '@/hooks/use-receipt-uploader';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { formatBytes } from '@/lib/helpers';
import { RocketIcon } from '@radix-ui/react-icons';
import { Copy, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ScannerPageProps {}

export function ScannerPage({ ...props }: ScannerPageProps) {
  const navigate = useNavigate();
  const { uploadFiles, uploadAll, errors } = useReceiptUploader();
  const { toast } = useToast();
  const isMobile = useDeviceWidth();

  const handleFileDrop = async function (files: FileList) {
    const { failedUploads, fulfilled } = await uploadAll(files);
    failedUploads.forEach((failedUpload) => {
      toast({
        variant: 'destructive',
        title: `Failed to upload ${failedUpload.file.name}`,
        description: failedUpload.message,
      });
    });
  };
  return (
    <DashboardLayout
      breadcrumbs={
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scanner</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      content={
        <div className="space-y-4">
          <Header
            title="Receipt Upload"
            // description="Manage your account settings and set e-mail preferences."
          />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadArea onFileProcessed={handleFileDrop} />
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex flex-col space-y-3 py-6 px-6 shrink-0 items-center justify-center rounded-md border bg-background cursor-pointer hover:shadow-lg">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div>
                        <Mail size={32} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="mt-2 font-semibold">
                          Receipt upload via email
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Quickly add receipts to your account
                        </p>
                      </div>
                    </div>
                  </button>
                </SheetTrigger>
                <SheetContent
                  className="sm:w-[540px]"
                  side={isMobile ? 'bottom' : 'right'}
                >
                  <SheetHeader>
                    <SheetTitle>Receipt upload via email</SheetTitle>
                    <SheetDescription>
                      An alternative way to enter receipts. Send an email with a
                      receipt image in the attachment to the below email
                      address.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your forwarding email</CardTitle>
                        <CardDescription>
                          To properly identify you, the sender must be your
                          account's email address
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CopyableText text="upload@snapceipt.com">
                          upload@snapceipt.com
                        </CopyableText>
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Tabs defaultValue="for-review" className="space-y-4">
              <TabsList>
                <TabsTrigger value="for-review">For review</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              </TabsList>
              <TabsContent value="for-review">
                <Card>
                  <CardHeader></CardHeader>
                  <CardContent>
                    <ReceiptsTable data={[]} variant="embedded" />
                  </CardContent>
                </Card>
                {/* {uploadFiles.map((uploadFile, index) => {
                  const url = URL.createObjectURL(uploadFile.file);
                  return (
                    <div
                      key={uploadFile.id}
                      className="flex items-center gap-4 border rounded-lg px-4 py-3"
                    >
                      <div className="w-[50px] h-[50px]">
                        <img
                          className="w-full h-full grayscale rounded-sm"
                          src={url}
                        />
                      </div>
                      <div>
                        <div className="font-normal text-sm">
                          {uploadFile.file.name}
                        </div>
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
                })} */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      }
    />
  );
}
