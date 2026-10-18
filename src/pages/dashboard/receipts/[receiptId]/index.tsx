import { ReceiptViewer } from '@/components/receipt-viewer';
import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { StatusIndicator } from '@/components/status-indicator';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';
import { useReceipt, useUpdateReceipt } from '@/queries/receipts';
import { useReceiptItems } from '@/queries/receipts';
import { useSubcategories } from '@/queries/categories';
import { ContentLayout } from '@/layout/content-layout';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { getFileUrl, getReceiptTitle } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionsDropdown } from '../components/actions-dropdown';
import { DuplicateReceiptNotice } from './components/duplicate-receipt-notice';
import { ReceiptInfoCard } from './components/receipt-info-card';
import { EditReceiptFormValues, ItemUpdatePayload } from './interfaces';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  usePageTitle('Receipt Details');
  const { receiptId } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: receipt,
    refetch: refetchReceipt,
    error,
    isLoading,
  } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);

  const transformItemToUpdatePayload = useCallback(
    (item: ItemData): ItemUpdatePayload => {
      return {
        name: item.generated_item_name || '',
        item_id: item.id || undefined,
        subcategory_id: item.subcategory_id || undefined,
        quantity: item.quantity || undefined,
        price: item.total_price || undefined,
      };
    },
    [],
  );

  const defaultValues = useMemo<EditReceiptFormValues>(() => {
    return {
      transaction_date: receipt?.transaction_date
        ? new Date(receipt.transaction_date)
        : undefined,
      items: items?.map(transformItemToUpdatePayload) || [],
      merchantOption: receipt?.merchant
        ? {
            label: receipt.merchant.name,
            value: receipt.merchant.id,
            imgSrc: receipt.merchant.logo_url
              ? getFileUrl(receipt.merchant.logo_url)
              : undefined,
          }
        : undefined,
      subtotal: receipt?.subtotal || '',
      sales_tax: receipt?.sales_tax || '',
      total: receipt?.total_amount || '',
      category_id: receipt?.category_id?.toString() || '',
    };
  }, [receipt, items, transformItemToUpdatePayload]);

  const form = useForm<EditReceiptFormValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues, { keepDirtyValues: true });
  }, [form, defaultValues]);

  const formValues = form.watch();

  const { data: subcategories } = useSubcategories(formValues.category_id);
  const { mutateAsync: updateReceipt } = useUpdateReceipt();

  const calculatedSubtotal = useMemo<string>(() => {
    const { items } = formValues;
    if (!items?.length) return '0';
    const sum = items.reduce(
      (prev, curr) => prev + (curr.price ? +curr.price : 0),
      0,
    );
    return sum.toFixed(2);
  }, [formValues]);

  async function onSubmit(values: EditReceiptFormValues) {
    try {
      if (!receipt?.id) return;
      const { merchantOption, ...rest } = values;
      await updateReceipt({
        receiptId: receipt.id,
        updates: { ...rest, merchant_id: merchantOption?.value || '' },
      });
      toast({ title: 'Saved!', description: 'Your receipt is all up to date.' });
    } catch (error) {
      toast({
        variant: 'oops',
        title: "Oops, that didn't save",
        description: 'Try saving the receipt again?',
      });
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <ContentLayout
          className="mx-auto max-w-3xl space-y-6"
          loading={isLoading}
          error={error}
          data={receipt}
        >
          {(receipt) => {
            return (
              <>
                <div className="flex flex-col gap-2 lg:flex-row">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="secondary"
                      size="icon"
                      className="shrink-0"
                    >
                      <ChevronLeft aria-hidden />
                      <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="type-h2 min-w-0 flex-1 truncate lg:flex-none">
                      {getReceiptTitle(receipt)}
                    </h1>
                    <StatusIndicator
                      status={receipt.reviewed ? 'success' : 'warning'}
                      className="ml-auto sm:ml-0"
                    >
                      {receipt.reviewed ? 'Looks good' : 'Needs a look'}
                    </StatusIndicator>
                  </div>
                  <div className="flex items-center justify-end gap-2 md:ml-auto md:flex">
                    {form.formState.isDirty ? (
                      <span className="hidden text-xs text-ink-muted md:inline">
                        Unsaved changes
                      </span>
                    ) : null}
                    <Button
                      size="sm"
                      form="edit-form"
                      type="submit"
                      className="hidden md:inline-flex"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isDirty
                      }
                    >
                      Save receipt
                    </Button>
                    <ActionsDropdown
                      receipt={receipt}
                      onDelete={(receipt) => navigate('/dashboard/receipts')}
                      onReviewed={async () => {
                        try {
                          refetchReceipt();
                          toast({ title: 'Looks good!', description: 'Marked as reviewed.' });
                        } catch (error) {
                          toast({
                            variant: 'oops',
                            title: "Oops, that didn't work",
                            description: 'Try marking it as reviewed again?',
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                {receipt.possible_duplicate_of ? (
                  <DuplicateReceiptNotice
                    originalReceiptId={receipt.possible_duplicate_of}
                  />
                ) : null}
                <div className="fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-20 flex items-center gap-3 border-t border-line bg-surface-raised/95 p-3 backdrop-blur-sm md:hidden">
                  <span className="flex-1 text-xs font-bold text-ink-muted">
                    {form.formState.isDirty ? 'Unsaved changes' : null}
                  </span>
                  <Button
                    form="edit-form"
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || !form.formState.isDirty
                    }
                  >
                    Save receipt
                  </Button>
                </div>
                <div className="grid gap-4 pb-16 md:pb-0">
                  <ReceiptViewer imageUrl={receipt.image_url} />
                  <Form {...form}>
                    <form id="edit-form" onSubmit={form.handleSubmit(onSubmit)}>
                      <ReceiptInfoCard
                        subcategories={subcategories}
                        receipt={receipt}
                      />
                    </form>
                  </Form>
                </div>
              </>
            );
          }}
        </ContentLayout>
      }
    />
  );
}
