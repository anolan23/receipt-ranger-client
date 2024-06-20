import clsx from 'clsx';
import {
  CircleAlert,
  CircleCheck,
  CircleCheckBig,
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
}

export function StatusIndicator({
  status,
  children,
  ...props
}: StatusIndicatorProps) {
  const statusColorMap: Record<StatusIndicatorStatus, string> = {
    warning: 'text-orange-700',
    destructive: 'text-red-700',
    loading: 'text-muted-secondary',
    pending: 'text-muted-secondary',
    success: 'text-green-700',
  };

  const renderIcon = function (status: StatusIndicatorStatus) {
    const size = 16;
    const color = statusColorMap[status];
    switch (status) {
      case 'warning':
        return <CircleAlert className={color} size={size} />;
      case 'destructive':
        return <CircleX className={color} size={size} />;
      case 'loading':
        return (
          <LoaderCircle className={clsx(color, 'animate-spin')} size={size} />
        );
      case 'pending':
        return <CircleEllipsis className={color} size={size} />;
      case 'success':
        return <CircleCheck className={color} size={size} />;
    }
  };
  return (
    <div className="flex gap-1 items-center text-sm">
      {renderIcon(status)}
      <span className={statusColorMap[status]}>{children}</span>
    </div>
  );
}
