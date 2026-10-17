import { forwardRef } from 'react';
import { Input } from './ui/input';
import { DollarSign } from 'lucide-react';
import { cn } from 'cn';

type DollarInputProps = React.ComponentProps<'input'>;

export const DollarInput = forwardRef<HTMLInputElement, DollarInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          className={cn('w-full rounded-lg bg-background pl-8', className)}
          type="number"
          inputMode="decimal"
          step={0.01}
          min={0}
          {...props}
        />
      </div>
    );
  }
);
