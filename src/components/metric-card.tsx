import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  loading?: boolean;
  percent?: number;
}

export function MetricCard({
  title,
  value,
  description,
  loading,
  percent = 1,
  ...props
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{value}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <div className="text-xs text-muted-foreground">{description}</div>
        </CardContent>
      )}
      <CardFooter>
        <Progress value={percent} />
      </CardFooter>
    </Card>
  );
}
