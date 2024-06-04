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
  const renderIcon = function () {
    const size = 16;
    switch (status) {
      case 'warning':
        return <CircleAlert className="text-muted-foreground" size={size} />;
      case 'destructive':
        return <CircleX className="text-muted-foreground" size={size} />;
      case 'loading':
        return (
          <LoaderCircle
            className="text-muted-foreground animate-spin"
            size={size}
          />
        );
      case 'pending':
        return <CircleEllipsis className="text-muted-foreground" size={size} />;
      case 'success':
        return <CircleCheck className="text-muted-foreground" size={size} />;
    }
  };
  return (
    <div className="flex gap-2 items-center text-sm">
      {renderIcon()}
      <span>{children}</span>
    </div>
  );
}
