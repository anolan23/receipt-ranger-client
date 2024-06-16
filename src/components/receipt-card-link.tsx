import { ReceiptData } from '@/lib/types';
import { Link } from 'react-router-dom';
import { ImageLogo } from './image-logo';
import dayjs from 'dayjs';
import { getS3FileUrl, toDollar } from '@/lib/helpers';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface ReceiptCardLinkProps {
  receipt: ReceiptData;
}

export function ReceiptCardLink({ receipt, ...props }: ReceiptCardLinkProps) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto w-full min-w-0 text-left items-center"
    >
      <Link to={`/dashboard/receipts/${receipt.id}`}>
        <div className="flex items-center min-w-0">
          <ImageLogo
            src={
              receipt.merchant.logo_url
                ? getS3FileUrl(receipt.merchant.logo_url)
                : ''
            }
            size={64}
          />
          <div className="flex-1 overflow-hidden mx-2">
            <div className="truncate">{receipt.merchant.name}</div>
            <div className="text-xs text-muted-foreground">
              {dayjs(receipt.transaction_date).format('YYYY/MM/DD')}
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          {receipt.total_amount && (
            <span>{toDollar(receipt.total_amount)}</span>
          )}
          <ChevronRight />
        </div>
      </Link>
    </Button>
  );
}
