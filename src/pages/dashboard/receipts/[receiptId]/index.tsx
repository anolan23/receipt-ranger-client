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
import { useSubcategories } from '@/hooks/use-subcategories';
import { ActionsDropdown } from '../components/actions-dropdown';

interface ReceiptPageProps {}

export function ReceiptPage({ ...props }: ReceiptPageProps) {
  const { receiptId } = useParams();

  const navigate = useNavigate();

  const { data: receipt } = useReceipt(receiptId);
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

  if (!receipt) return <div>Loading...</div>;

  async function onSubmit(values: EditReceiptFormValues) {
    try {
      if (!receipt?.id) return;
      const { merchantOption, ...rest } = values;
      await updateReceipt(receipt.id, {
        ...rest,
        merchant_id: merchantOption?.value || '',
      });
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
        <div className="space-y-4 mx-auto max-w-[59rem]">
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
              <Button
                size="sm"
                form="edit-form"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Save Receipt
              </Button>
              <ActionsDropdown receipt={receipt} />
            </div>
          </div>
          <Form {...form}>
            <form id="edit-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-8">
                <ReceiptInfoCard />
                <div className="space-y-2 min-w-0">
                  <LineItemsCard subcategories={subcategories} />
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
