import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Pip, PipMood } from './mascot';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  mood?: PipMood;
  /** Show Pip. Pip appears at most once per screen. */
  pip?: boolean;
  action?: ReactNode;
  className?: string;
}

/** Empty, error and permission states: kind copy and a way forward. */
export function EmptyState({
  title,
  description,
  mood = 'happy',
  pip,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'grid justify-items-center gap-2 px-5 py-6 text-center',
        className
      )}
    >
      {pip && <Pip mood={mood} size={112} />}
      <h3 className="font-display text-xl leading-[26px] font-semibold">
        {title}
      </h3>
      {description && (
        <p className="max-w-[34ch] text-sm leading-5 text-ink-muted">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
