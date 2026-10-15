import { getReceiptTitle, getS3FileUrl, toDollar } from '@/lib/helpers';
import { ReceiptData } from '@/lib/types';
import { ActionsDropdown } from '@/pages/dashboard/receipts/components/actions-dropdown';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Edit2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageLogo } from './image-logo';
import { LineItem } from './line-item';
import { Button } from './ui/button';
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Separator } from './ui/separator';

interface ReceiptSheetContentProps {
  receipt?: ReceiptData;
  onPreviousClick?: () => void;
  onNextClick?: () => void;
  onDeleteSuccess?: (receipt: ReceiptData) => void;
}

export function ReceiptSheetContent({
  receipt,
  onPreviousClick,
  onNextClick,
  onDeleteSuccess,
}: ReceiptSheetContentProps) {
  const transactionDate = receipt?.transaction_date
    ? dayjs(receipt.transaction_date).format('MMMM D, YYYY')
    : '-';
  const scanned = receipt?.created_at
    ? dayjs(receipt.created_at).fromNow()
    : '-';

  return (
    <>
      <SheetHeader className="flex flex-row items-start gap-2 p-4 pr-12 text-left">
        <div className="grid min-w-0 gap-1.5">
          <SheetTitle className="truncate">
            {receipt ? getReceiptTitle(receipt) : 'Receipt'}
          </SheetTitle>
          <SheetDescription>{`Date: ${transactionDate}`}</SheetDescription>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
            <Link to={receipt ? `/dashboard/receipts/${receipt.id}` : ''}>
              <Edit2Icon className="h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <ActionsDropdown receipt={receipt} onDelete={onDeleteSuccess} />
        </div>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Line Items</div>
          {receipt?.items?.length ? (
            <ul className="grid gap-3">
              {receipt.items.map((item) => (
                <LineItem
                  key={item.id}
                  name={item.generated_item_name || undefined}
                  quantity={item.quantity || undefined}
                  price={item.total_price || undefined}
                  subcategory={item.subcategory || undefined}
                />
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">No Receipt Items</div>
          )}
        </div>
        <Separator className="my-4" />
        <ul className="grid gap-3">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{receipt?.subtotal ? toDollar(receipt.subtotal) : '-'}</span>
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
        <Separator className="my-4" />
        <div className="grid gap-3 pb-4">
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
                  <ImageLogo
                    src={getS3FileUrl(receipt.merchant.logo_url)}
                    size={48}
                  />
                ) : (
                  '-'
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <SheetFooter className="flex-row items-center border-t p-4 sm:justify-between sm:space-x-0">
        <div className="text-xs text-muted-foreground">Scanned {scanned}</div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            onClick={onPreviousClick}
            size="icon"
            variant="outline"
            className="h-6 w-6"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Previous Receipt</span>
          </Button>
          <Button
            onClick={onNextClick}
            size="icon"
            variant="outline"
            className="h-6 w-6"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="sr-only">Next Receipt</span>
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
