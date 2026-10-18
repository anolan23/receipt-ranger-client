import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePlan } from '@/hooks/use-plan';
import { useScanUsage } from '@/queries/receipts';
import { CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UsageMeterProps {
  /** Query string added to the membership link so Back returns to the right page. */
  from?: 'scan' | 'settings';
}

/** Free-plan scan usage. Renders nothing for Pro, while loading, or if usage can't be loaded. */
export function UsageMeter({ from }: UsageMeterProps) {
  const { tier, isLoading: planLoading } = usePlan();
  const { data: usage } = useScanUsage();
  if (planLoading || tier === 'pro' || !usage || usage.limit === null) {
    return null;
  }

  const { used, limit } = usage;
  const left = Math.max(limit - used, 0);
  const atLimit = left === 0;
  const nearLimit = !atLimit && used / limit >= 0.8;
  const resets = new Date(usage.resets_at);
  const resetLabel = Number.isNaN(resets.getTime())
    ? undefined
    : resets.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-bold">
          <span className="num">
            {Math.min(used, limit)} of {limit}
          </span>{' '}
          free scans used
        </span>
        {resetLabel && (
          <span className="text-xs text-ink-muted">Resets {resetLabel}</span>
        )}
      </div>
      <Progress
        value={Math.min((used / limit) * 100, 100)}
        aria-label="Free scans used this month"
        aria-valuetext={`${Math.min(used, limit)} of ${limit} scans used`}
      />
      {(nearLimit || atLimit) && (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="rise">
            <CircleAlert aria-hidden />
            {atLimit ? 'No scans left' : `${left} left`}
          </Badge>
          <Button asChild variant="link" size="sm">
            <Link
              to={{ pathname: '/membership', search: from ? `c=${from}` : '' }}
            >
              Go unlimited
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
