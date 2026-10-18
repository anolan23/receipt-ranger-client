import { cn } from '@/lib/utils';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CircleX,
  LoaderCircle,
} from 'lucide-react';
import { ReactNode } from 'react';

export type StatusIndicatorStatus =
  | 'destructive'
  | 'success'
  | 'warning'
  | 'pending'
  | 'loading';

interface StatusIndicatorProps {
  status: StatusIndicatorStatus;
  children: ReactNode;
  className?: string;
}

/**
 * Status pill. Status is never colour alone: every pill has an icon and a word.
 * success = done, warning = take a peek, destructive = oops, pending = queued,
 * loading = reading.
 */
export function StatusIndicator({
  status,
  children,
  className,
}: StatusIndicatorProps) {
  const styles: Record<StatusIndicatorStatus, string> = {
    success: 'bg-win-bg text-win-ink',
    warning: 'bg-rise-bg text-rise-ink',
    destructive: 'bg-oops-bg text-oops-ink',
    pending:
      'border-[1.5px] border-dashed border-outline bg-surface-200 text-ink',
    loading: 'bg-info-bg text-info-ink',
  };

  const renderIcon = function (status: StatusIndicatorStatus) {
    const props = { size: 14, 'aria-hidden': true } as const;
    switch (status) {
      case 'warning':
        return <CircleAlert {...props} />;
      case 'destructive':
        return <CircleX {...props} />;
      case 'loading':
        return <LoaderCircle {...props} className="animate-spin" />;
      case 'pending':
        return <CircleEllipsis {...props} />;
      case 'success':
        return <CircleCheck {...props} />;
    }
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-[3px] text-[13px] leading-5 font-bold whitespace-nowrap',
        styles[status],
        className
      )}
    >
      {renderIcon(status)}
      {children}
    </span>
  );
}
