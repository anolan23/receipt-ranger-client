import { forwardRef } from 'react';
import { Input } from './ui/input';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type DollarInputProps = React.ComponentProps<'input'>;

export const DollarInput = forwardRef<HTMLInputElement, DollarInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <DollarSign
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted"
        />
        <Input
          ref={ref}
          className={cn('w-full pl-9', className)}
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
