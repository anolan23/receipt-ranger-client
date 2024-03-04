import dayjs from 'dayjs';
import { Avatar, AvatarImage } from './ui/avatar';
import wfm from '../assets/wfm.png';
import { ReceiptData } from '@/lib/types';

interface ReceiptItemProps {
  receipt: ReceiptData;
}

export function ReceiptItem({ receipt, ...props }: ReceiptItemProps) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={wfm} className="grayscale" />
      </Avatar>
      <div className="ml-4 space-y-1">
        <div className="text-sm font-medium leading-none">
          {receipt.store_name}
        </div>
        <div className="text-sm text-muted-foreground">
          {dayjs(receipt.transaction_date).format('MMMM D, YYYY')}
        </div>
      </div>
      <div className="ml-auto font-medium">{`$${receipt.total_amount}`}</div>
    </div>
  );
}
