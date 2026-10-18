import { LoadingState } from '@/components/loading-state';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useMemo } from 'react';
import { toDollar } from '@/lib/helpers';
import { TopBaseItemResult } from '@/lib/types';

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
        <CardTitle>Your top items</CardTitle>
        <CardDescription>Like chicken, apples or milk</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState />
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
    <div className="space-y-1.5 py-2">
      <div className="flex items-center justify-between gap-3 text-sm font-bold">
        <div className="capitalize">{topBaseItem.label || 'Not sure what this is'}</div>
        <div className="num">{`${percent}% · ${toDollar(topBaseItem.total)}`}</div>
      </div>
      <Progress value={percent} />
    </div>
  );
}
