import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusIndicator } from './status-indicator';

interface MetricCardProps {
  title: string;
  value?: string | number;
  description?: string;
  loading?: boolean;
  percent?: number;
}

export function MetricCard({
  title,
  value,
  description,
  loading,
  percent,
  ...props
}: MetricCardProps) {
  const hasPercentage = typeof percent === 'number';
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        {loading ? (
          <StatusIndicator status="loading">Loading</StatusIndicator>
        ) : (
          <CardTitle className="text-4xl">{value}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {loading ? null : (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </CardContent>
      <CardFooter>{hasPercentage && <Progress value={percent} />}</CardFooter>
    </Card>
  );
}
