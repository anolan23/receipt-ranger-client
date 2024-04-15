import { DeleteReceiptDialog } from '@/components/delete-receipt-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteReceipt } from '@/lib/api/receipts';
import { ReceiptData } from '@/lib/types';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';
import { toast } from 'sonner';

interface ActionsDropdownProps {
  receipt: ReceiptData;
}

export function ActionsDropdown({ receipt, ...props }: ActionsDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  const { mutate } = useSWRConfig();

  function handleDialogItemOpenChange(open: boolean) {
    if (open === false) {
      setDropdownOpen(false);
      //Because of dropdown content exit animation
      setTimeout(() => setHasOpenDialog(false), 1000);
    } else {
      setHasOpenDialog(open);
    }
  }

  const handleDeleteSubmit = useCallback(
    async (receipt: ReceiptData) => {
      try {
        if (!receipt?.id) return;
        await deleteReceipt(receipt.id);
        mutate('/receipts');
        toast('Receipt deleted');
      } catch (error) {
        let message = 'Something went wrong';
        if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      }
    },
    [mutate]
  );

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" hidden={hasOpenDialog}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DeleteReceiptDialog
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          }
          receipt={receipt}
          onDeleteSubmit={handleDeleteSubmit}
          onOpenChange={handleDialogItemOpenChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
