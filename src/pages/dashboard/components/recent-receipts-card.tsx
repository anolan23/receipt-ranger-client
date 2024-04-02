import { ReceiptItem } from '@/components/receipt-item';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReceiptData } from '@/lib/types';
import { ReceiptsTable } from '@/pages/receipts/components/receipts-table';

interface RecentReceiptsCardProps {
  receipts?: ReceiptData[];
  loading?: boolean;
}

export function RecentReceiptsCard({
  receipts,
  loading,
  ...props
}: RecentReceiptsCardProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>You scanned 9 receipts this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* {receipts?.map((receipt) => (
          <ReceiptItem key={receipt.id} receipt={receipt} />
        ))} */}
        <ReceiptsTable
          data={receipts || []}
          variant="embedded"
          initialColumnVisibility={{
            created_at: false,
          }}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
