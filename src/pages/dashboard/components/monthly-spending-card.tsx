import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StackedBarChart from './bar-chart';

interface MonthlySpendingCardProps {}

export function MonthlySpendingCard({ ...props }: MonthlySpendingCardProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <StackedBarChart />
      </CardContent>
    </Card>
  );
}
