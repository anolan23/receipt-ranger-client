import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface RecentReceiptsCardProps {}

export function RecentReceiptsCard({ ...props }: RecentReceiptsCardProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>You scanned 9 receipts this month.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
