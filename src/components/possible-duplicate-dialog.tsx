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
import { cn } from "@/lib/utils";

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
            This looks like a receipt you&apos;ve already added. Keep both, or
            delete the one you just uploaded?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep both</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={onDelete}
          >
            Delete this one
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
