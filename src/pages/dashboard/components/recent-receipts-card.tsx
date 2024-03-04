import { ReceiptItem } from '@/components/receipt-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReceiptData } from '@/lib/types';

interface RecentReceiptsCardProps {
  receipts?: ReceiptData[];
}

export function RecentReceiptsCard({
  receipts,
  ...props
}: RecentReceiptsCardProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>You scanned 9 receipts this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {receipts?.map((receipt) => (
          <ReceiptItem key={receipt.id} receipt={receipt} />
        ))}
      </CardContent>
    </Card>
  );
}
