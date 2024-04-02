import { Loader } from '@/components/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Metric = {
  title: string;
  value: string | number;
  description?: string;
};

interface MetricCardProps {
  metric: Metric;
  loading?: boolean;
}

export function MetricCard({ metric, loading }: MetricCardProps) {
  const { title, value, description } = metric;
  const renderValue = function () {
    if (loading) {
      return <Loader />;
    }
    return (
      <>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </>
    );
  };
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="tracking-tight text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderValue()}</CardContent>
    </Card>
  );
}
