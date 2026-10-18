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
import { AlertDialogProps } from '@radix-ui/react-alert-dialog';
import { ReactElement } from 'react';

interface DeleteReceiptDialogProps extends AlertDialogProps {
  trigger: ReactElement;
  receipt?: ReceiptData;
  deleting?: boolean;
  onDeleteSubmit: (receipt: ReceiptData) => void;
}

export function DeleteReceiptDialog({
  trigger,
  receipt,
  deleting,
  onDeleteSubmit,
  ...props
}: DeleteReceiptDialogProps) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = function (
    event
  ) {
    event.preventDefault();
    if (!receipt) return;
    onDeleteSubmit(receipt);
  };
  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <form id="delete-receipt-form" onSubmit={handleSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this receipt?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the receipt and all of its line items for good, so
              there's no undoing it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <Button
              type="submit"
              form="delete-receipt-form"
              variant="danger"
              disabled={deleting}
            >
              Delete receipt
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}
