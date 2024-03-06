import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { deleteReceipt } from '@/lib/api/receipts';
import { ReceiptData } from '@/lib/types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DeleteReceiptMenuItemProps {
  receipt?: ReceiptData;
  onDeleteSubmit: (receipt: ReceiptData) => Promise<void>;
}

export function DeleteReceiptMenuItem({
  receipt,
  onDeleteSubmit,
  ...props
}: DeleteReceiptMenuItemProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const isDisabled = useMemo(() => {
    return value !== 'permanently delete';
  }, [value]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async function (
    event
  ) {
    event.preventDefault();
    if (!receipt) return;
    await onDeleteSubmit(receipt);
    setOpen(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Delete
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <form id="delete-receipt-form" onSubmit={handleSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {receipt?.store_name
                ? `Permanently delete ${receipt?.store_name} receipt?`
                : 'Permanently delete receipt?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              To confirm deletion, type <i>permanently delete</i> in the text
              input field.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            placeholder="permanently delete"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              form="delete-receipt-form"
              variant="destructive"
              disabled={isDisabled}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}
