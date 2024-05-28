import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useDeviceWidth } from '@/hooks/use-device-width';
import { ReactNode, useState } from 'react';

interface DrawerDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  content?: ReactNode;
  action?: ReactNode;
}

export function DrawerDialog({
  title,
  description,
  trigger,
  content,
  action,
}: DrawerDialogProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useDeviceWidth();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="space-y-4 px-4">{content}</div>
          <DrawerFooter className="pt-4">
            {action}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DialogHeader>
        {content}
        {action}
      </DialogContent>
    </Dialog>
  );
}
