import { getFileUrl, toDollar } from '@/lib/helpers';
import { ReceiptData } from '@/lib/types';
import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryBadge } from './category-badge';
import { ImageLogo } from './image-logo';

interface ReceiptCardLinkProps {
  receipt: ReceiptData;
}

/** Phone receipt card: merchant, date, amount and category badge. */
export function ReceiptCardLink({ receipt }: ReceiptCardLinkProps) {
  return (
    <Link
      to={`/dashboard/receipts/${receipt.id}`}
      className="flex min-h-14 items-center gap-3 rounded-md border border-line bg-surface-raised p-3 transition-[transform,box-shadow] duration-[220ms] ease-bounce hover:-translate-y-0.5 hover:shadow-soft"
    >
      <ImageLogo
        src={
          receipt.merchant.logo_url ? getFileUrl(receipt.merchant.logo_url) : ''
        }
        size={48}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{receipt.merchant.name}</div>
        <div className="num text-[13px] text-ink-muted">
          {dayjs(receipt.transaction_date).format('MMM D, YYYY')}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        {receipt.total_amount && (
          <span className="num font-bold">{toDollar(receipt.total_amount)}</span>
        )}
        <CategoryBadge label={receipt.category?.label} />
      </div>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-ink-muted" />
    </Link>
  );
}
