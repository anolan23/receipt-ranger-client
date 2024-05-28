import { forwardRef } from 'react';
import { Input, InputProps } from './ui/input';
import { DollarSign } from 'lucide-react';

interface DollarInputProps extends InputProps {}

export const DollarInput = forwardRef<HTMLInputElement, DollarInputProps>(
  ({ ...props }, ref) => {
    return (
      <div className="relative">
        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          className="w-full rounded-lg bg-background pl-8"
          type="number"
          inputMode="numeric"
          step={0.01}
          min={0}
          {...props}
        />
      </div>
    );
  }
);
