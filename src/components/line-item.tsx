import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { DrawerDialog } from './drawer-dialog';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { ChevronRight, Trash2Icon } from 'lucide-react';

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
            <button
              type="button"
              className="group flex min-h-[3.25rem] w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-4 sm:py-2.5"
            >
              <ItemSummary
                name={name}
                quantity={quantity}
                price={price}
                subcategory={subcategory}
              />
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60 group-hover:text-foreground" />
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
      </li>
    );
  }
  return (
    <li className="flex items-start gap-3 px-3 py-3 sm:px-4 sm:py-2.5">
      <ItemSummary
        name={name}
        quantity={quantity}
        price={price}
        subcategory={subcategory}
      />
    </li>
  );
}

function ItemSummary({
  name,
  quantity,
  price,
  subcategory,
}: Pick<LineItemProps, 'name' | 'quantity' | 'price' | 'subcategory'>) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-snug">
          {name || 'Unnamed item'}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          {quantity && quantity > 1 ? (
            <span className="tabular-nums">Qty {quantity}</span>
          ) : null}
          {subcategory ? (
            <span className="truncate">{subcategory}</span>
          ) : (
            <span className="italic">No category</span>
          )}
        </div>
      </div>
      <span className="min-w-[4.5rem] shrink-0 text-right text-sm font-medium tabular-nums">
        {price ? (
          toDollar(price)
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
      </span>
    </>
  );
}
