import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ReactNode } from 'react';
import { LoadingState } from './loading-state';
import { Pip } from './mascot';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export interface MetricTrend {
  /** `win`: it went down, a good thing. `rise`: it went up, a gentle amber heads-up. */
  tone: 'win' | 'rise';
  text: string;
}

interface MetricCardProps {
  title: string;
  value?: string | number;
  description?: ReactNode;
  trend?: MetricTrend;
  loading?: boolean;
  percent?: number;
  /** The hero KPI: butter ground with Pip peeking in the corner. */
  hero?: boolean;
  className?: string;
}

/**
 * KPI card. A change is always shown with an arrow and words, never colour
 * alone: a decrease is a green win with a down arrow, an increase is amber.
 */
export function MetricCard({
  title,
  value,
  description,
  trend,
  loading,
  percent,
  hero,
  className,
}: MetricCardProps) {
  const hasPercentage = typeof percent === 'number';
  return (
    <Card
      className={cn(
        'gap-1 px-5 py-4.5',
        hero && 'overflow-hidden border-transparent bg-blob-butter pr-28 text-ink',
        className
      )}
    >
      <div
        className={cn(
          'text-[13px] leading-[18px] font-bold',
          hero ? 'text-ink' : 'text-ink-muted'
        )}
      >
        {title}
      </div>
      {loading ? (
        <LoadingState label="Counting…" className="py-2" />
      ) : (
        <>
          <div
            className={cn(
              'num font-display font-semibold',
              hero
                ? 'text-4xl leading-10 md:text-[40px] md:leading-11'
                : 'text-2xl leading-[30px] md:text-[30px] md:leading-9'
            )}
          >
            {value}
          </div>
          {trend && (
            <span
              className={cn(
                'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-[13px] leading-5 font-bold',
                trend.tone === 'win'
                  ? 'bg-win-bg text-win-ink'
                  : 'bg-rise-bg text-rise-ink'
              )}
            >
              {trend.tone === 'win' ? (
                <ArrowDown aria-hidden className="size-3.5" />
              ) : (
                <ArrowUp aria-hidden className="size-3.5" />
              )}
              {trend.text}
            </span>
          )}
          {description && (
            <div
              className={cn(
                'text-[13px] leading-[18px]',
                hero ? 'text-ink' : 'text-ink-muted'
              )}
            >
              {description}
            </div>
          )}
          {hasPercentage && <Progress value={percent} className="mt-2" />}
        </>
      )}
      {hero && (
        <Pip
          mood="happy"
          size={96}
          className="absolute right-3 -bottom-1.5"
        />
      )}
    </Card>
  );
}
