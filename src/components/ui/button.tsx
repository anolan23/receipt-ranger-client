import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

/**
 * Pill buttons, 48px tall (44px small, 60px large). One `primary` per view for
 * the main job, `secondary` for alternatives, `ghost` for low-priority links.
 */
const buttonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-transparent',
    'font-bold whitespace-nowrap select-none',
    'transition-[transform,background-color,box-shadow,color] duration-[220ms] ease-bounce',
    'hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-px active:scale-[0.99]',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-5',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary shadow-button hover:bg-primary-hover active:shadow-none',
        secondary:
          'border-outline bg-surface-raised text-ink hover:bg-surface-200',
        soft: 'bg-primary-soft text-ink hover:bg-primary-soft hover:brightness-95',
        danger:
          'bg-oops-bg text-oops-ink border-oops-ink hover:brightness-95',
        ghost:
          'text-ink underline decoration-outline decoration-2 underline-offset-4 hover:decoration-primary',
        link: 'text-primary underline underline-offset-4 hover:text-primary-hover',
      },
      size: {
        default: 'min-h-12 px-6 text-[15px] leading-none',
        sm: 'min-h-11 px-[18px] text-sm leading-none',
        lg: 'min-h-[60px] px-8 text-[17px] leading-none',
        icon: 'size-11 p-0',
      },
    },
    compoundVariants: [
      { variant: 'ghost', size: 'icon', className: 'no-underline hover:bg-surface-200' },
      { variant: 'link', size: 'icon', className: 'no-underline' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
