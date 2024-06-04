import { ReceiptData } from '@/lib/types';
import { Link } from 'react-router-dom';
import { ImageLogo } from './image-logo';
import dayjs from 'dayjs';
import { toDollar } from '@/lib/helpers';
import { ChevronRight } from 'lucide-react';

interface ReceiptCardLinkProps {
  receipt: ReceiptData;
}

export function ReceiptCardLink({ receipt, ...props }: ReceiptCardLinkProps) {
  return (
    <Link
      to={`/dashboard/receipts/${receipt.id}`}
      className="w-full min-w-0 rounded-lg border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-8 text-left"
    >
      <div className="flex items-center">
        <div className="flex items-center">
          <ImageLogo src={receipt.merchant.logo_url || ''} size={64} />
          <div className="flex-1 overflow-hidden mx-2">
            <div className="truncate">{receipt.merchant.name}</div>
            <div className="text-sm text-muted-foreground">
              {dayjs(receipt.transaction_date).format('YYYY/MM/DD')}
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {receipt.total_amount && (
            <span>{toDollar(receipt.total_amount)}</span>
          )}
          <ChevronRight />
        </div>
      </div>
    </Link>
  );
}
