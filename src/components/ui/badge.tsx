import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

/**
 * Badges, pills and delta chips. Colour is never the only signal: pair every
 * status with an icon and a word, every delta with an arrow and words.
 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full px-3 py-[3px] text-[13px] leading-5 font-bold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3.5',
  {
    variants: {
      variant: {
        neutral: 'border-[1.5px] border-outline bg-surface-raised text-ink',
        queued: 'border-[1.5px] border-dashed border-outline bg-surface-200 text-ink',
        reading: 'bg-info-bg text-info-ink',
        win: 'bg-win-bg text-win-ink',
        rise: 'bg-rise-bg text-rise-ink',
        oops: 'bg-oops-bg text-oops-ink',
        primary: 'bg-primary text-on-primary',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
