import { toDollar } from '@/lib/helpers';
import { ItemData, ReceiptData } from '@/lib/types';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit2Icon,
  MoreVertical,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageLogo } from './image-logo';
import { StatusIndicator } from './status-indicator';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem } from './ui/pagination';
import { Separator } from './ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { useState } from 'react';
import { ActionsDropdown } from '@/pages/dashboard/receipts/components/actions-dropdown';
import CopyableText from './copyable-text';
import { Badge } from './ui/badge';

const NUM_VISIBLE_ITEMS: number = 4;

interface ReceiptCardProps {
  title?: string;
  receipt?: ReceiptData;
  className?: string;
  headerHidden?: boolean;
  loading?: boolean;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

export function ReceiptCard({
  receipt,
  className,
  headerHidden,
  title,
  loading,
  onPreviousClick,
  onNextClick,
  ...props
}: ReceiptCardProps) {
  const [expanded, setExpanded] = useState(false);
  const transactionDate = receipt?.transaction_date
    ? dayjs(receipt.transaction_date).format('MMMM D, YYYY')
    : undefined;
  const modifiedDateShort =
    receipt?.updated_at && dayjs(receipt.updated_at).format('YYYY-MM-DD');
  const modifiedDate =
    receipt?.updated_at && dayjs(receipt.updated_at).format('MMMM D, YYYY');

  const renderItemList = function () {
    if (!receipt?.items?.length)
      return (
        <div className="p-4 flex items-center justify-center text-sm">
          No Receipt Items
        </div>
      );
    if (receipt?.items?.length <= NUM_VISIBLE_ITEMS) {
      return (
        <ul className="grid gap-3">
          {receipt?.items?.slice(0, NUM_VISIBLE_ITEMS).map((item) => (
            <LineItem key={item.id} item={item} />
          ))}
        </ul>
      );
    }
    return (
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <ul className="grid gap-3">
          {receipt?.items?.slice(0, NUM_VISIBLE_ITEMS).map((item) => (
            <LineItem key={item.id} item={item} />
          ))}
        </ul>
        <CollapsibleContent className="grid gap-3" asChild>
          <ul className="mt-3">
            {receipt?.items?.slice(NUM_VISIBLE_ITEMS).map((item) => (
              <LineItem key={item.id} item={item} />
            ))}
          </ul>
        </CollapsibleContent>
        <div className="pt-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {expanded ? 'Collapse' : 'Show all'}
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    );
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      {!headerHidden && (
        <CardHeader className="flex flex-row items-start bg-muted/50 gap-2">
          <div className="grid gap-0.5">
            <CopyableText text={receipt?.id || '-'}>
              <CardTitle className="truncate flex-1">
                Receipt {receipt?.id || 'Preview'}
              </CardTitle>
            </CopyableText>
            <CardDescription>{`Date: ${
              transactionDate || '-'
            }`}</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {receipt ? (
              <Button size="sm" variant="outline" asChild>
                <Link
                  to={receipt?.id ? `/dashboard/receipts/${receipt.id}` : ''}
                  className="h-8 gap-1"
                >
                  <Edit2Icon className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Edit
                  </span>
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="h-8 gap-1"
              >
                <Edit2Icon className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Edit
                </span>
              </Button>
            )}
            <ActionsDropdown receipt={receipt} />
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Line Items</div>
          {renderItemList()}
          <Separator className="my-4" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {receipt?.subtotal ? toDollar(receipt.subtotal) : '-'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>
                {receipt?.sales_tax ? toDollar(receipt.sales_tax) : '-'}
              </span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>
                {receipt?.total_amount ? toDollar(receipt.total_amount) : '-'}
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Merchant Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Merchant</dt>
              <dd>{receipt?.merchant.name || '-'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Logo</dt>
              <dd>
                {receipt?.merchant.logo_url ? (
                  <ImageLogo src={receipt.merchant.logo_url} size={48} />
                ) : (
                  '-'
                )}
              </dd>
            </div>
          </dl>
        </div>
        {/* <Separator className="my-4" />
            <div className="grid gap-3">
              <div className="font-semibold">Payment Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Visa
                  </dt>
                  <dd>**** **** **** 4532</dd>
                </div>
              </dl>
            </div> */}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{' '}
          {modifiedDate && modifiedDateShort ? (
            <time dateTime={modifiedDateShort}>{modifiedDate}</time>
          ) : (
            '-'
          )}
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                onClick={onPreviousClick}
                size="icon"
                variant="outline"
                className="h-6 w-6"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Receipt</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                onClick={onNextClick}
                size="icon"
                variant="outline"
                className="h-6 w-6"
              >
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Receipt</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

interface LineItemProps {
  item: ItemData;
}
function LineItem({ item }: LineItemProps) {
  const { generated_item_name, quantity, total_price } = item;
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">
        {generated_item_name} x <span>{quantity}</span>
      </span>
      <span>{total_price ? toDollar(total_price) : '-'}</span>
    </li>
  );
}
