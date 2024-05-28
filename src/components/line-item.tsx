import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { Badge } from './ui/badge';
import { DrawerDialog } from './drawer-dialog';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Trash2Icon } from 'lucide-react';

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
  const renderItemName = function () {
    switch (variant) {
      case 'edit':
        return (
          <DrawerDialog
            title="Edit Item"
            trigger={
              <button className="text-sm text-muted-foreground underline underline-offset-4 decoration-dashed text-left">
                <div className="">
                  {name} x {quantity}
                </div>
              </button>
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
        );
      default:
        return (
          <span className="text-muted-foreground">
            {name} x {quantity}
          </span>
        );
    }
  };
  return (
    <li className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        {renderItemName()}
        {subcategory && <Badge variant="secondary">{subcategory}</Badge>}
      </div>
      <span className="text-sm">{price ? toDollar(price) : '-'}</span>
    </li>
  );
}
