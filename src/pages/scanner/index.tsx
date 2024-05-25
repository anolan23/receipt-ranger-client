import CopyableText from '@/components/copyable-text';
import { Link } from '@/components/link';

import { ReceiptsTable } from '@/components/receipts-table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { UploadArea } from '@/components/upload-area';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { useReceiptUploader } from '@/hooks/use-receipt-uploader';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { CheckCheck, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadFileProgress } from './components/upload-file-progress';
import { useReceipts } from '@/hooks/use-receipts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActionsDropdown } from '../dashboard/receipts/components/actions-dropdown';
import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { TextFilter } from '@/components/text-filter';
import { Pagination } from '@/components/pagination';

interface ScannerPageProps {}

export function ScannerPage({ ...props }: ScannerPageProps) {
  const navigate = useNavigate();
  const { uploadFiles, uploadAll, errors, uploading, removeFileFromUpload } =
    useReceiptUploader();
  const { toast } = useToast();
  const isMobile = useDeviceWidth();
  const { data: receipts, mutate: mutateReviewReceipts } = useReceipts({
    reviewed: false,
  });
  const { data: reviewedReceipts } = useReceipts({
    reviewed: true,
  });

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
        <div className="space-y-4 mx-auto">
          <h1 className="text-xl font-semibold tracking-tight">
            Receipt Scanner
          </h1>
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
                          Receipt processing via email
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
                    <SheetTitle>Receipt processing via email</SheetTitle>
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
                          To properly identify your account, the sender must be
                          your email address that is on file
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
              <TabsContent value="for-review" className="space-y-4">
                {uploadFiles.length ? (
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="processing"
                  >
                    <AccordionItem value="processing">
                      <AccordionTrigger className="text-lg font-bold">
                        Processing {`(${uploadFiles.length})`}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <div className="space-y-2">
                          {uploadFiles.map((file) => (
                            <UploadFileProgress
                              key={file.id}
                              uploadFile={file}
                              onUploadSuccess={(result) => {
                                removeFileFromUpload(file.id);
                                mutateReviewReceipts();
                              }}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
                <ReceiptsTable
                  variant="border"
                  data={receipts || []}
                  tools={(table) => (
                    <div className="flex items-center">
                      <TextFilter
                        table={table}
                        placeholder="Filter Receipts..."
                      />
                      <div className="ml-auto flex items-center gap-2">
                        <ColumnFilterDropdown table={table} />
                      </div>
                    </div>
                  )}
                  footerControls={(table) => <Pagination table={table} />}
                  selectionType="multiple"
                />
              </TabsContent>
              <TabsContent value="reviewed" className="space-y-4">
                <ReceiptsTable
                  variant="border"
                  data={reviewedReceipts || []}
                  tools={(table) => (
                    <div className="flex items-center">
                      <TextFilter
                        table={table}
                        placeholder="Filter Receipts..."
                      />
                      <div className="ml-auto flex items-center gap-2">
                        <ColumnFilterDropdown table={table} />
                      </div>
                    </div>
                  )}
                  footerControls={(table) => <Pagination table={table} />}
                  selectionType="multiple"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      }
    />
  );
}
