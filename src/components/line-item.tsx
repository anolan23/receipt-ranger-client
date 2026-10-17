import { toDollar } from '@/lib/helpers';
import { ItemData } from '@/lib/types';
import { DrawerDialog } from './drawer-dialog';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { ChevronRight, Trash2Icon } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from './ui/item';

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
            <Item
              asChild
              size="sm"
              className="group min-h-13 w-full cursor-pointer items-start rounded-none text-left hover:bg-muted/50 active:bg-muted"
            >
              <button type="button">
                <ItemSummary
                  name={name}
                  quantity={quantity}
                  price={price}
                  subcategory={subcategory}
                  chevron
                />
              </button>
            </Item>
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
    <li className="min-w-0">
      <Item size="sm" className="items-start rounded-none">
        <ItemSummary
          name={name}
          quantity={quantity}
          price={price}
          subcategory={subcategory}
        />
      </Item>
    </li>
  );
}

function ItemSummary({
  name,
  quantity,
  price,
  subcategory,
  chevron,
}: Pick<LineItemProps, 'name' | 'quantity' | 'price' | 'subcategory'> & {
  chevron?: boolean;
}) {
  return (
    <>
      <ItemContent className="min-w-0">
        <ItemTitle className="w-full truncate">
          {name || 'Unnamed item'}
        </ItemTitle>
        <ItemDescription className="flex items-center gap-2 text-xs">
          {quantity && quantity > 1 ? (
            <span className="tabular-nums">Qty {quantity}</span>
          ) : null}
          {subcategory ? (
            <span className="truncate">{subcategory}</span>
          ) : (
            <span className="italic">No category</span>
          )}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="min-w-18 justify-end text-sm font-medium tabular-nums">
        {price ? (
          toDollar(price)
        ) : (
          <span className="text-muted-foreground">--</span>
        )}
        {chevron && (
          <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-foreground" />
        )}
      </ItemActions>
    </>
  );
}
