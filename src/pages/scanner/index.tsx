import CopyableText from '@/components/copyable-text';
import { Link } from '@/components/link';

import { ColumnFilterDropdown } from '@/components/column-filter-dropdown';
import { Pagination } from '@/components/pagination';
import { ReceiptsTable } from '@/components/receipts-table';
import { TextFilter } from '@/components/text-filter';
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
import { useReceipts } from '@/hooks/use-receipts';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadFileProgress } from './components/upload-file-progress';
import { ActionsDropdown } from '../dashboard/receipts/components/actions-dropdown';
import { useRowSelection } from '@/hooks/use-row-selection';
import { usePageTitle } from '@/hooks/use-page-title';
import { Cards } from '@/components/cards';
import { ReceiptCardLink } from '@/components/receipt-card-link';
import { PossibleDuplicateDialog } from '@/components/possible-duplicate-dialog';
import { deleteReceipt } from '@/lib/api/receipts';

interface ScannerPageProps {}

export function ScannerPage({ ...props }: ScannerPageProps) {
  usePageTitle('Scanner');
  const navigate = useNavigate();
  const { uploadFiles, uploadAll } = useReceiptUploader();
  const { toast } = useToast();
  const isMobile = useDeviceWidth();
  const {
    data: receipts,
    mutate: mutateReceipts,
    isLoading: isReceiptsLoading,
  } = useReceipts({
    reviewed: false,
  });

  const { rowSelection, setRowSelection, selectedRow } = useRowSelection({
    selectFirstOnMOunt: true,
    data: receipts,
  });

  // Ids of just-uploaded receipts flagged as possible duplicates, asked about one at a time.
  const [pendingDuplicateIds, setPendingDuplicateIds] = useState<string[]>([]);
  const currentDuplicateId = pendingDuplicateIds[0];
  const popDuplicate = () => setPendingDuplicateIds((ids) => ids.slice(1));

  const deleteDuplicate = async function () {
    // The dialog's close handler pops the queue, so don't pop here too.
    const receiptId = currentDuplicateId;
    if (!receiptId) return;
    try {
      await deleteReceipt(receiptId);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete receipt',
        description: error instanceof Error ? error.message : undefined,
      });
    }
    mutateReceipts();
  };

  const handleFileDrop = async function (files: FileList) {
    const { failedUploads, fulfilled } = await uploadAll(files);
    const duplicateIds = fulfilled
      .filter((result) => result.potential_duplicate)
      .map((result) => result.receipt_id);
    if (duplicateIds.length) {
      setPendingDuplicateIds((ids) => [...ids, ...duplicateIds]);
    }
    if (fulfilled.length) {
      mutateReceipts();
      toast({
        title: `${fulfilled.length === 1 ? 'Receipt' : 'Receipts'} created`,
        description: 'The receipt details have been stored for your records.',
      });
    }
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
          <PossibleDuplicateDialog
            open={currentDuplicateId !== undefined}
            onClose={popDuplicate}
            onDelete={deleteDuplicate}
          />
          <h1 className="text-xl font-semibold tracking-tight">
            Receipt Scanner
          </h1>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadArea onFileProcessed={handleFileDrop} />
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex w-full flex-col items-center rounded-md border bg-card p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted/50 sm:p-8">
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
                      An alternative way to enter receipts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your forwarding email</CardTitle>
                        <CardDescription>
                          Send an email with a receipt image in the attachment
                          to the below email address.
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
            {uploadFiles.length ? (
              <Accordion type="single" collapsible defaultValue="processing">
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
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}
            <ReceiptsTable
              data={receipts || []}
              header={
                <CardHeader>
                  <CardTitle>Receipts pending review</CardTitle>
                </CardHeader>
              }
              tools={(table) => (
                <div className="flex items-center">
                  <TextFilter table={table} placeholder="Filter Receipts..." />
                  <div className="ml-auto flex items-center gap-2">
                    <ColumnFilterDropdown table={table} />
                    <ActionsDropdown
                      receipt={selectedRow}
                      onDelete={() => mutateReceipts()}
                      onReviewed={() => {
                        mutateReceipts();
                      }}
                    />
                  </div>
                </div>
              )}
              footerControls={(table) => <Pagination table={table} />}
              selectionType="single"
              rowSelection={rowSelection}
              onRowSelectionChange={setRowSelection}
              loading={isReceiptsLoading}
            />
            <Cards
              hidden={!isMobile}
              loading={isReceiptsLoading}
              loadingText="Loading Receipts"
              emptyText="No Receipts to review"
              data={receipts || []}
              renderCard={(receipt) => (
                <ReceiptCardLink key={receipt.id} receipt={receipt} />
              )}
            />
          </div>
        </div>
      }
    />
  );
}
