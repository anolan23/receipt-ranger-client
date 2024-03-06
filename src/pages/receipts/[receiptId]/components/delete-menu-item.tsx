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

interface DeleteMenuItemProps {
  receipt: ReceiptData;
}

export function DeleteMenuItem({ receipt, ...props }: DeleteMenuItemProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const isDisabled = useMemo(() => {
    return value !== 'permanently delete';
  }, [value]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async function (
    event
  ) {
    try {
      event.preventDefault();

      if (!receipt.id) return;
      await deleteReceipt(receipt.id);
      setOpen(false);
      navigate('/receipts');
      toast({
        description: 'Receipt deleted',
      });
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        description: message,
      });
    }
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
              {`Permanently delete ${receipt.store_name} receipt?`}
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
