import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReceiptData } from '@/lib/types';
import { ReceiptsTable } from '../../../components/receipts-table';

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
    <Card className="min-w-0 md:col-span-1">
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>
          Showing the five most recent receipts by Document date
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
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
