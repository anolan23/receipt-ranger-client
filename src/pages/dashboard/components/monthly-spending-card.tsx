import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlySpendingCardProps {}

export function MonthlySpendingCard({ ...props }: MonthlySpendingCardProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
