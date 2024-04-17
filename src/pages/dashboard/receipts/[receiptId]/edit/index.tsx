import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useReceipt } from '@/hooks/use-receipt';
import { useReceiptItems } from '@/hooks/use-receipt-items';
import { DashboardLayout } from '@/layout/dashboard-layout';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { LineItemsCard } from './components/line-items-card';
import { MerchantInfoCard } from './components/merchant-info-card';
import { PaymentInfoCard } from './components/payment-info-card';
import { ReceiptInfoCard } from './components/receipt-info-card';
import { StatusCard } from './components/status-card';
import { EditReceiptFormValues, ItemUpdatePayload } from './interfaces';
import { useCategories } from '@/hooks/use-categories';
import { ItemData } from '@/lib/types';
import { updateReceipt } from '@/lib/api/receipts';
import { toast } from 'sonner';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();

  const navigate = useNavigate();

  const { data: receipt } = useReceipt(receiptId);
  const { data: items } = useReceiptItems(receiptId);
  const { data: categories } = useCategories();

  const transformItemToUpdatePayload = function (
    item: ItemData
  ): ItemUpdatePayload {
    return {
      name: item.generated_item_name || '',
      item_id: item.id || undefined,
      category_id: item.category_id || undefined,
      quantity: item.quantity || undefined,
      price: item.total_price || undefined,
    };
  };

  const defaultValues = useMemo<EditReceiptFormValues>(() => {
    return {
      transaction_date: receipt?.transaction_date
        ? new Date(receipt.transaction_date)
        : undefined,
      items: items?.map(transformItemToUpdatePayload) || [],
      receipt_status: '',
      payment_card_number: '',
      merchant_logo_url: receipt?.merchant.logo_url || '',
      merchant_name: receipt?.merchant.name || '',
    };
  }, [receipt, items]);

  const form = useForm<EditReceiptFormValues>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  if (!receipt) return <div>Loading...</div>;

  async function onSubmit(values: EditReceiptFormValues) {
    try {
      if (!receipt?.id) return;
      const result = await updateReceipt(receipt.id, values);
      toast('Receipt updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update Receipt');
    }
  }

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
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                  {/* <MerchantInfoCard /> */}
                  <LineItemsCard categories={categories} />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                  {/* <StatusCard /> */}
                  <ReceiptInfoCard />
                  <MerchantInfoCard />
                  <PaymentInfoCard />
                </div>
              </div>
            </form>
          </Form>
        </div>
      }
    />
  );
}
