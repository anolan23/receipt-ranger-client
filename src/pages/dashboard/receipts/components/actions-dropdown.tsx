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
import { MoreVertical } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';

interface ActionsDropdownProps {
  receipt: ReceiptData;
}

export function ActionsDropdown({ receipt, ...props }: ActionsDropdownProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);

  const { mutate, cache } = useSWRConfig();
  console.log(cache);

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
        mutate('/receipts?limit=5');
        toast('Receipt deleted');
      } catch (error) {
        let message = 'Something went wrong';
        if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      } finally {
        setDropdownOpen(false);
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
        <Button size="icon" variant="outline" className="h-8 w-8">
          <MoreVertical className="h-3.5 w-3.5" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" hidden={hasOpenDialog}>
        <DropdownMenuItem disabled>Export</DropdownMenuItem>
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
