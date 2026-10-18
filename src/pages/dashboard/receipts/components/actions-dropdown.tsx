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

  const deleteReceipt = useDeleteReceipt();
  const updateReviewStatus = useUpdateReceiptReviewStatus();

  const showError = useCallback(
    (error: unknown) => {
      toast({
        variant: 'oops',
        title: "Oops, that didn't work",
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      });
    },
    [toast]
  );

  const { mutate: deleteReceiptMutate } = deleteReceipt;
  const handleDeleteSubmit = useCallback(
    (receipt: ReceiptData) => {
      if (!receipt?.id) return;
      deleteReceiptMutate(receipt.id, {
        onSuccess: () => {
          onDelete && onDelete(receipt);
          toast({ title: 'Receipt deleted', description: 'All tidied up.' });
        },
        onError: showError,
        onSettled: () => {
          setDropdownOpen(false);
          setHasOpenDialog(false);
        },
      });
    },
    [toast, onDelete, deleteReceiptMutate, showError]
  );

  const handleReviewSelect = function () {
    if (!receipt) return;
    updateReviewStatus.mutate(
      { receiptId: receipt.id, reviewed: true },
      {
        onSuccess: () => onReviewed && onReviewed(receipt),
        onError: showError,
      }
    );
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
          disabled={receipt?.reviewed || updateReviewStatus.isPending}
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
          deleting={deleteReceipt.isPending}
          onDeleteSubmit={handleDeleteSubmit}
          onOpenChange={handleDialogItemOpenChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
