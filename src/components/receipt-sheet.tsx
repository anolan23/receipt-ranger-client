import { ReceiptData } from '@/lib/types';
import { ReceiptSheetContent } from './receipt-sheet-content';
import { Sheet, SheetContent } from './ui/sheet';

interface ReceiptSheetProps {
  open: boolean;
  receipt?: ReceiptData;
  onClose: () => void;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onDeleteSuccess?: (receipt: ReceiptData) => void;
}

export function ReceiptSheet({
  open,
  receipt,
  onClose,
  onPreviousClick,
  onNextClick,
  onDeleteSuccess,
}: ReceiptSheetProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <ReceiptSheetContent
          receipt={receipt}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
          onDeleteSuccess={onDeleteSuccess}
        />
      </SheetContent>
    </Sheet>
  );
}
