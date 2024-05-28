import { DocViewerCard } from '@/components/doc-viewer-card';
import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import { useSubcategories } from '@/hooks/use-subcategories';
import { ContentLayout } from '@/layout/content-layout';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { ErrorLayout } from '@/layout/error-layout';
import { updateReceipt } from '@/lib/api/receipts';
import { ItemData } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionsDropdown } from '../components/actions-dropdown';
import { ReceiptInfoCard } from './components/receipt-info-card';
import { EditReceiptFormValues, ItemUpdatePayload } from './interfaces';
import { usePageTitle } from '@/hooks/use-page-title';
import { useDeviceWidth } from '@/hooks/use-device-width';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  usePageTitle('Receipt Details');
  const { receiptId } = useParams();

  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: receipt,
    mutate: mutateReceipt,
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
    []
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
            imgSrc: receipt.merchant.logo_url || undefined,
            description: receipt.merchant.id,
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
    form.reset(defaultValues);
  }, [form, defaultValues]);

  const formValues = form.watch();

  const { data: subcategories } = useSubcategories(formValues.category_id);

  const calculatedSubtotal = useMemo<string>(() => {
    const { items } = formValues;
    if (!items?.length) return '0';
    const sum = items.reduce(
      (prev, curr) => prev + (curr.price ? +curr.price : 0),
      0
    );
    return sum.toFixed(2);
  }, [formValues]);

  async function onSubmit(values: EditReceiptFormValues) {
    try {
      if (!receipt?.id) return;
      const { merchantOption, ...rest } = values;
      await updateReceipt(receipt.id, {
        ...rest,
        merchant_id: merchantOption?.value || '',
      });
      toast({ title: 'Receipt successfully updated' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update Receipt',
      });
    }
  }

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <ContentLayout
          className="space-y-4"
          loading={isLoading}
          error={error}
          data={receipt}
        >
          {(receipt) => {
            return (
              <>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="flex-1 shrink-0 truncate text-xl font-semibold tracking-tight lg:flex-none">
                      {`Receipt ${receipt.id}`}
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                      {receipt.reviewed ? 'Reviewed' : 'Pending review'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-end gap-2 md:ml-auto md:flex">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      form="edit-form"
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      Save Receipt
                    </Button>
                    <ActionsDropdown
                      receipt={receipt}
                      onDelete={(receipt) => navigate('/dashboard/receipts')}
                      onReviewed={async () => {
                        try {
                          mutateReceipt();
                          toast({ title: 'Receipt reviewed' });
                        } catch (error) {
                          toast({
                            variant: 'destructive',
                            title: 'Error',
                            description: 'Failed to review receipt',
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-8 md:grid-cols-[400px_1fr]">
                  <DocViewerCard objectKey={receipt.object_key || undefined} />
                  <div className="sm:overflow-y-auto">
                    <Form {...form}>
                      <form
                        id="edit-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                      >
                        <div className="grid gap-8">
                          <ReceiptInfoCard
                            subcategories={subcategories}
                            receipt={receipt}
                          />
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </>
            );
          }}
        </ContentLayout>
      }
    />
  );
}
