import dayjs from 'dayjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import wfm from '../assets/wfm.png';
import { ReceiptData } from '@/lib/types';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface ReceiptItemProps {
  receipt: ReceiptData;
}

export function ReceiptItem({ receipt, ...props }: ReceiptItemProps) {
  return (
    <Button
      className="flex items-center text-left w-full h-auto font-normal"
      variant="ghost"
      asChild
    >
      <Link to={`/receipts/${receipt.id}`}>
        <Avatar className="h-9 w-9">
          <AvatarImage src={receipt.merchant.logo_url || undefined} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <div className="text-sm font-medium leading-none">
            {receipt.merchant.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {dayjs(receipt.transaction_date).format('MMMM D, YYYY')}
          </div>
        </div>
        <div className="ml-auto font-medium">{`$${receipt.total_amount}`}</div>
      </Link>
    </Button>
  );
}
