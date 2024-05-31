import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { Badge } from './ui/badge';
import { DrawerDialog } from './drawer-dialog';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Trash2Icon } from 'lucide-react';
import { useDeviceWidth } from '@/hooks/use-device-width';

interface LineItemProps {
  variant?: 'default' | 'edit';
  content?: ReactNode;
  name?: string;
  quantity?: number;
  price?: string;
  subcategory?: string;
  onRemoveClick?: () => void;
}
export function LineItem({
  name,
  quantity,
  price,
  subcategory,
  variant = 'default',
  content,
  onRemoveClick,
}: LineItemProps) {
  if (variant === 'edit') {
    return (
      <li className="min-w-0">
        <DrawerDialog
          title="Edit Item"
          trigger={
            <Button
              type="button"
              variant="outline"
              className="w-full h-auto block text-base sm:text-sm text-left font-normal"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-full min-w-0">
                  <div className="truncate sm:mb-1">
                    {name} x {quantity}
                  </div>
                  {subcategory && (
                    <Badge variant="secondary" className="">
                      {subcategory}
                    </Badge>
                  )}
                </div>
                <span className="">{price ? toDollar(price) : '-'}</span>
              </div>
            </Button>
          }
          content={content}
          action={
            <Button
              type="button"
              onClick={onRemoveClick}
              variant="destructive"
              className="gap-1"
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Remove Item
            </Button>
          }
        />
      </li>
    );
  }
  return (
    <li className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-muted-foreground">
          {name} x {quantity}
        </span>
        {subcategory && (
          <Badge variant="secondary" className="">
            {subcategory}
          </Badge>
        )}
      </div>
      <span className="">{price ? toDollar(price) : '-'}</span>
    </li>
  );
}
