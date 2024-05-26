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
import { deleteReceipt, updateReceiptReviewStatus } from '@/lib/api/receipts';
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

  const handleDeleteSubmit = useCallback(
    async (receipt: ReceiptData) => {
      try {
        if (!receipt?.id) return;
        await deleteReceipt(receipt.id);
        onDelete && onDelete(receipt);
        toast({ variant: 'default', title: 'Receipt deleted' });
      } catch (error) {
        let message = 'Something went wrong';
        if (error instanceof Error) {
          message = error.message;
        }
        toast({ variant: 'destructive', title: 'Error', description: message });
      } finally {
        setDropdownOpen(false);
        setHasOpenDialog(false);
      }
    },
    [toast, onDelete]
  );

  const handleReviewSelect = async function () {
    try {
      if (!receipt) return;
      await updateReceiptReviewStatus(receipt.id, true);
      onReviewed && onReviewed(receipt);
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({ variant: 'destructive', title: 'Error', description: message });
    }
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          disabled={!receipt}
        >
          <MoreVertical className="h-3.5 w-3.5" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" hidden={hasOpenDialog}>
        <DropdownMenuItem disabled>Export to .csv</DropdownMenuItem>
        <DropdownMenuItem
          disabled={receipt?.reviewed}
          onSelect={handleReviewSelect}
        >
          Mark as reviewed
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteReceiptDialog
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Trash
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
