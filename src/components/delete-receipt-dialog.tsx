import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ReceiptData } from '@/lib/types';
import { DialogProps } from '@radix-ui/react-alert-dialog';
import { ReactElement } from 'react';

interface DeleteReceiptDialogProps extends DialogProps {
  trigger: ReactElement;
  receipt?: ReceiptData;
  onDeleteSubmit: (receipt: ReceiptData) => Promise<void>;
}

export function DeleteReceiptDialog({
  trigger,
  receipt,
  onDeleteSubmit,
  ...props
}: DeleteReceiptDialogProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async function (
    event
  ) {
    event.preventDefault();
    if (!receipt) return;
    await onDeleteSubmit(receipt);
  };
  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <form id="delete-receipt-form" onSubmit={handleSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {receipt?.id
                ? `Permanently delete Receipt ${receipt?.id}?`
                : 'Permanently delete receipt?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              receipt along with any associated line items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              form="delete-receipt-form"
              variant="destructive"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}
