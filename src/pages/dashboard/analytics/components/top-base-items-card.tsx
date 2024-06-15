import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import styles from './index.module.scss';
import { Progress } from '@/components/ui/progress';
import { useMemo } from 'react';
import { toDollar } from '@/lib/helpers';
import { TopBaseItemResult } from '@/lib/types';
import { StatusIndicator } from '@/components/status-indicator';

interface TopBaseItemCardProps {
  data: TopBaseItemResult[];
  className?: string;
  loading?: boolean;
}

export function TopBaseItemCard({
  data,
  className,
  loading,
  ...props
}: TopBaseItemCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top Base Items</CardTitle>
        <CardDescription>e.g. chicken, apple, beef</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <StatusIndicator status="loading">Loading</StatusIndicator>
        ) : (
          <div className="flex flex-col">
            {data.map((datum) => (
              <BaseItemStat key={datum.label} topBaseItem={datum} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface BaseItemStatProps {
  topBaseItem: TopBaseItemResult;
}
function BaseItemStat({ topBaseItem }: BaseItemStatProps) {
  const percent = useMemo(
    () => Math.round(+topBaseItem.ratio * 100),
    [topBaseItem.ratio]
  );
  return (
    <div className="p-2 space-y-1">
      <div className="text-sm flex items-center justify-between">
        <div className="capitalize">{topBaseItem.label || 'Not specified'}</div>
        <div>{`${percent}%, ${toDollar(topBaseItem.total)}`}</div>
      </div>
      <Progress value={percent} />
    </div>
  );
}
