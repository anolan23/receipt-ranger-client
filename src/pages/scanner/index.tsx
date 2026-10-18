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
import { Header } from '@/components/header';
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
        variant: 'oops',
        title: "Oops, I couldn't delete that receipt",
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
        title: `Nice, ${fulfilled.length} ${
          fulfilled.length === 1 ? 'receipt' : 'receipts'
        } scanned!`,
        description: 'Take a quick look below to make sure I got it right.',
      });
    }
    failedUploads.forEach((failedUpload) => {
      toast({
        variant: 'oops',
        title: `Oops, ${failedUpload.file.name} was tricky to read`,
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
                <Link to="/dashboard">Overview</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Scan</BreadcrumbPage>
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
          <Header
            title="Let's scan a receipt!"
            description="Snap a photo or drop a file and I'll read the rest."
          />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadArea onFileProcessed={handleFileDrop} />
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex w-full flex-col items-center rounded-lg border border-line bg-surface-raised p-6 text-ink shadow-soft transition-[transform,box-shadow] duration-[220ms] ease-bounce hover:-translate-y-[3px] hover:shadow-lift sm:p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-blob-sky">
                        <Mail aria-hidden className="size-7" />
                      </span>
                      <div className="space-y-1">
                        <h3 className="mt-3 font-display text-xl font-semibold">
                          Email it to me
                        </h3>
                        <p className="mt-1 text-sm text-ink-muted">
                          Forward a receipt and I'll add it for you
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
                    <SheetTitle>Email it to me</SheetTitle>
                    <SheetDescription>
                      Another way to add receipts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your forwarding address</CardTitle>
                        <CardDescription>
                          Attach a photo of your receipt and send it to the address
                          below.
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
                  <AccordionTrigger>
                    Reading your receipts…{' '}
                    <span className="num font-sans text-base font-bold text-ink-muted">
                      ({uploadFiles.length})
                    </span>
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
                  <CardTitle>Waiting for a quick look</CardTitle>
                </CardHeader>
              }
              tools={(table) => (
                <div className="flex items-center">
                  <TextFilter table={table} placeholder="Search receipts…" />
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
              loadingText="Counting the coupons…"
              emptyText="All caught up! Nothing to review."
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
