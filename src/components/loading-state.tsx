import { cn } from '@/lib/utils';
import { Pip } from './mascot';

interface LoadingStateProps {
  label?: string;
  /** Show a squinting Pip. Use for whole-page loads, at most once per screen. */
  pip?: boolean;
  className?: string;
}

/** Skeleton bars that shimmer left to right, with a friendly line. */
export function LoadingState({
  label = 'Counting the coupons…',
  pip,
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-6 text-center',
        className
      )}
    >
      {pip && <Pip mood="reading" size={96} />}
      <div className="grid w-full max-w-64 gap-2" aria-hidden>
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
      <p className="text-sm font-bold text-ink-muted">{label}</p>
    </div>
  );
}
