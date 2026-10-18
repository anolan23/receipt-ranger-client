import { getFileUrl, getReceiptTitle, toDollar } from '@/lib/helpers';
import { ReceiptData } from '@/lib/types';
import { ActionsDropdown } from '@/pages/dashboard/receipts/components/actions-dropdown';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryBadge } from './category-badge';
import { ImageLogo } from './image-logo';
import { LineItem } from './line-item';
import { ReceiptViewer } from './receipt-viewer';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

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
      <SheetHeader className="gap-3 border-b border-line p-6 pr-16 text-left">
        <div className="flex items-center gap-3">
          <ImageLogo
            src={
              receipt?.merchant.logo_url
                ? getFileUrl(receipt.merchant.logo_url)
                : undefined
            }
            size={48}
          />
          <div className="grid min-w-0 gap-0.5">
            <SheetTitle className="truncate text-[22px] leading-7">
              {receipt?.merchant.name ?? 'Receipt'}
            </SheetTitle>
            <SheetDescription>{transactionDate}</SheetDescription>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge label={receipt?.category?.label} />
          <div className="ml-auto flex shrink-0 items-center gap-1">
            <Button size="sm" variant="secondary" asChild>
              <Link to={receipt ? `/dashboard/receipts/${receipt.id}` : ''}>
                <Pencil aria-hidden />
                Edit
              </Link>
            </Button>
            <ActionsDropdown receipt={receipt} onDelete={onDeleteSuccess} />
          </div>
        </div>
      </SheetHeader>
      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-6 py-5 text-sm">
        <div className="grid gap-5">
          {receipt && (
            <div className="grid gap-2">
              <h3 className="type-h3">The scanned receipt</h3>
              <ReceiptViewer imageUrl={receipt.image_url} />
            </div>
          )}
          <div className="grid gap-2">
            <h3 className="type-h3">What I found</h3>
            {receipt?.items?.length ? (
              <ul>
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
              <div className="py-4 text-center text-ink-muted">
                I couldn&apos;t find any line items on this one.
              </div>
            )}
          </div>
          <Separator />
          <dl className="grid gap-2">
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="num font-bold">
                {receipt?.subtotal ? toDollar(receipt.subtotal) : '-'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink-muted">Tax</dt>
              <dd className="num font-bold">
                {receipt?.sales_tax ? toDollar(receipt.sales_tax) : '-'}
              </dd>
            </div>
            <div className="flex items-center justify-between pt-1 font-display text-lg font-semibold">
              <dt>Total</dt>
              <dd className="num">
                {receipt?.total_amount ? toDollar(receipt.total_amount) : '-'}
              </dd>
            </div>
          </dl>
          {receipt && (
            <p className="sr-only">{getReceiptTitle(receipt)}</p>
          )}
        </div>
      </div>
      <SheetFooter className="flex-row items-center border-t border-line p-4 px-6">
        <div className="text-xs text-ink-muted">Scanned {scanned}</div>
        <div className="ml-auto flex items-center gap-1">
          <Button onClick={onPreviousClick} size="icon" variant="secondary">
            <ChevronLeft aria-hidden />
            <span className="sr-only">Previous receipt</span>
          </Button>
          <Button onClick={onNextClick} size="icon" variant="secondary">
            <ChevronRight aria-hidden />
            <span className="sr-only">Next receipt</span>
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}
