import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface PossibleDuplicateDialogProps {
  open: boolean;
  /** Closed via Keep both / Esc; the receipt stays and keeps its stored duplicate link. */
  onClose: () => void;
  onDelete: () => void;
}

export function PossibleDuplicateDialog({
  open,
  onClose,
  onDelete,
}: PossibleDuplicateDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Possible duplicate</AlertDialogTitle>
          <AlertDialogDescription>
            This looks a lot like a receipt you already added. Keep both, or
            delete the one you just scanned?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep both</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "danger" }))}
            onClick={onDelete}
          >
            Delete this one
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
