import * as React from 'react';
import { cn } from '@/lib/utils';

/** Pill input: 48px, 2px `outline` border, surface-raised ground. */
function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      className={cn(
        'min-h-12 w-full min-w-0 rounded-full border-2 border-outline bg-surface-raised px-[18px] text-[15px] leading-none font-semibold text-ink',
        'placeholder:font-semibold placeholder:text-ink-muted',
        'transition-colors duration-[120ms] hover:bg-surface-100',
        'file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-ink',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-oops-ink',
        '[&::-webkit-search-cancel-button]:appearance-none',
        className
      )}
      {...props}
    />
  );
}

export { Input };
