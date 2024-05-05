import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { StatusIndicator } from '@/components/status-indicator';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useCategories } from '@/hooks/use-categories';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { updateReceipt } from '@/lib/api/receipts';
import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LineItemsCard } from './components/line-items-card';
import { ReceiptInfoCard } from './components/receipt-info-card';
import { EditReceiptFormValues, ItemUpdatePayload } from './interfaces';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();

  const navigate = useNavigate();

  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  const { data: categories } = useCategories();

  const transformItemToUpdatePayload = useCallback(
    (item: ItemData): ItemUpdatePayload => {
      return {
        name: item.generated_item_name || '',
        item_id: item.id || undefined,
        category_id: item.category_id || undefined,
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
      receipt_status: '',
      payment_card_number: '',
      merchantOption: receipt?.merchant
        ? {
            label: receipt.merchant.name,
            value: receipt.merchant.name,
            imgSrc: receipt.merchant.logo_url || undefined,
            description: receipt.merchant.id,
          }
        : undefined,
      subtotal: receipt?.subtotal || '',
      sales_tax: receipt?.sales_tax || '',
      total: receipt?.total_amount || '',
    };
  }, [receipt, items, transformItemToUpdatePayload]);

  const form = useForm<EditReceiptFormValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  const formValues = form.watch();

  const calculatedSubtotal = useMemo<string>(() => {
    const { items } = formValues;
    if (!items?.length) return '0';
    const sum = items.reduce(
      (prev, curr) => prev + (curr.price ? +curr.price : 0),
      0
    );
    return sum.toFixed(2);
  }, [formValues]);

  if (!receipt) return <div>Loading...</div>;

  async function onSubmit(values: EditReceiptFormValues) {
    try {
      if (!receipt?.id) return;
      const result = await updateReceipt(receipt.id, values);
      toast.success('Receipt updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update Receipt');
    }
  }

  const statusIndicatorStatus =
    calculatedSubtotal === formValues.subtotal ? 'success' : 'warning';

  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-4 mx-auto">
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
            <h1 className="flex-1 shrink-0 truncate text-xl font-semibold tracking-tight">
              {`Receipt ${receipt.id}`}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button onClick={() => navigate(-1)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button size="sm" form="edit-form" type="submit">
                Save Receipt
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form id="edit-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  {/* <StatusCard /> */}
                  {/* <MerchantInfoCard merchants={merchants} /> */}
                  <ReceiptInfoCard />
                  {/* <PaymentInfoCard /> */}
                </div>
                <div className="lg:col-span-2 space-y-2">
                  {/* <MerchantInfoCard /> */}
                  <LineItemsCard categories={categories} />
                  <div>
                    <StatusIndicator
                      status={statusIndicatorStatus}
                    >{`Calculated subtotal: ${toDollar(
                      calculatedSubtotal
                    )}`}</StatusIndicator>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      }
    />
  );
}
