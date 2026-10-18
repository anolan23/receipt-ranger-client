import { DeleteReceiptDialog } from '@/components/delete-receipt-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  useDeleteReceipt,
  useUpdateReceiptReviewStatus,
} from '@/queries/receipts';
import { ReceiptData } from '@/lib/types';
import { MoreVertical } from 'lucide-react';
import { useCallback, useState } from 'react';

interface ActionsDropdownProps {
  receipt?: ReceiptData;
  onDelete?: (receipt: ReceiptData) => void;
  onReviewed?: (receipt: ReceiptData) => void;
}

export function ActionsDropdown({
  receipt,
  onDelete,
  onReviewed,
  ...props
}: ActionsDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  const { toast } = useToast();

  function handleDialogItemOpenChange(open: boolean) {
    if (open === false) {
      setDropdownOpen(false);
      //Because of dropdown content exit animation
      setTimeout(() => setHasOpenDialog(false), 1000);
    } else {
      setHasOpenDialog(open);
    }
  }

  const { mutateAsync: deleteReceipt } = useDeleteReceipt();
  const { mutateAsync: updateReviewStatus } = useUpdateReceiptReviewStatus();

  const handleDeleteSubmit = useCallback(
    async (receipt: ReceiptData) => {
      try {
        if (!receipt?.id) return;
        await deleteReceipt(receipt.id);
        onDelete && onDelete(receipt);
        toast({ title: 'Receipt deleted', description: 'All tidied up.' });
      } catch (error) {
        let message = 'Something went wrong';
        if (error instanceof Error) {
          message = error.message;
        }
        toast({ variant: 'oops', title: "Oops, that didn't work", description: message });
      } finally {
        setDropdownOpen(false);
        setHasOpenDialog(false);
      }
    },
    [toast, onDelete, deleteReceipt]
  );

  const handleReviewSelect = async function () {
    try {
      if (!receipt) return;
      await updateReviewStatus({ receiptId: receipt.id, reviewed: true });
      onReviewed && onReviewed(receipt);
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({ variant: 'oops', title: "Oops, that didn't work", description: message });
    }
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary" disabled={!receipt}>
          <MoreVertical aria-hidden />
          <span className="sr-only">More actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" hidden={hasOpenDialog}>
        <DropdownMenuItem disabled>Export to .csv</DropdownMenuItem>
        <DropdownMenuItem
          disabled={receipt?.reviewed}
          onSelect={handleReviewSelect}
        >
          Looks good, mark reviewed
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteReceiptDialog
          trigger={
            <DropdownMenuItem
              variant="danger"
              onSelect={(e) => e.preventDefault()}
            >
              Delete receipt
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
