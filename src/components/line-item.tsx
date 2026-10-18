import { toDollar } from '@/lib/helpers';
import { ChevronRight, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import { DrawerDialog } from './drawer-dialog';
import { Button } from './ui/button';

interface LineItemProps {
  variant?: 'default' | 'edit';
  content?: ReactNode;
  name?: string;
  quantity?: number;
  price?: string;
  subcategory?: string;
  /** Pip's gentle "can you double-check this one?" highlight. */
  flagged?: boolean;
  onRemoveClick?: () => void;
}
export function LineItem({
  name,
  quantity,
  price,
  subcategory,
  variant = 'default',
  content,
  flagged,
  onRemoveClick,
}: LineItemProps) {
  if (variant === 'edit') {
    return (
      <li className="min-w-0">
        <DrawerDialog
          title="Edit item"
          trigger={
            <button
              type="button"
              className="group flex min-h-13 w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-surface-200 active:bg-primary-soft"
            >
              <ItemSummary
                name={name}
                quantity={quantity}
                price={price}
                subcategory={subcategory}
                flagged={flagged}
                chevron
              />
            </button>
          }
          content={content}
          action={
            <Button
              type="button"
              onClick={onRemoveClick}
              variant="danger"
              size="sm"
            >
              <Trash2 aria-hidden />
              Remove item
            </Button>
          }
        />
      </li>
    );
  }
  return (
    <li className="min-w-0 border-b-[1.5px] border-dashed border-line last:border-b-0">
      <div className="flex items-start gap-3 py-2">
        <ItemSummary
          name={name}
          quantity={quantity}
          price={price}
          subcategory={subcategory}
          flagged={flagged}
        />
      </div>
    </li>
  );
}

function ItemSummary({
  name,
  quantity,
  price,
  subcategory,
  flagged,
  chevron,
}: Pick<LineItemProps, 'name' | 'quantity' | 'price' | 'subcategory' | 'flagged'> & {
  chevron?: boolean;
}) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <div className="w-full truncate text-sm leading-5 font-bold">
          {name || 'Unnamed item'}
        </div>
        <div className="flex items-center gap-2 text-xs leading-4 text-ink-muted">
          {quantity && quantity > 1 ? (
            <span className="num">Qty {quantity}</span>
          ) : null}
          {subcategory ? (
            <span className="truncate">{subcategory}</span>
          ) : (
            <span className="italic">No category yet</span>
          )}
          {flagged && (
            <span className="rounded-full bg-rise-bg px-2 text-rise-ink">
              Can you double-check this one?
            </span>
          )}
        </div>
      </div>
      <div className="num flex min-w-18 items-center justify-end gap-1 text-sm font-bold">
        {price ? (
          toDollar(price)
        ) : (
          <span className="text-ink-muted">--</span>
        )}
        {chevron && (
          <ChevronRight
            aria-hidden
            className="size-4 text-ink-muted group-hover:text-ink"
          />
        )}
      </div>
    </>
  );
}
