import {
  CircleAlert,
  CircleCheckBig,
  CircleX,
  LoaderCircle,
} from 'lucide-react';
import { ReactNode } from 'react';

type StatusIndicatorStatus = 'destructive' | 'success' | 'warning' | 'loading';

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
      case 'success':
        return <CircleCheckBig className="text-muted-foreground" size={size} />;
    }
  };
  return (
    <div className="flex gap-2 items-center text-sm">
      {renderIcon()}
      <span>{children}</span>
    </div>
  );
}
