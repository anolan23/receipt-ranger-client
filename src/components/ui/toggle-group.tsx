import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

/** Segmented selector (e.g. 3M / 6M / 12M). */
function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        'inline-flex w-fit flex-wrap items-center gap-1 rounded-full bg-surface-200 p-1',
        className
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold whitespace-nowrap text-ink-muted transition-colors',
        'hover:text-ink data-[state=on]:bg-surface-raised data-[state=on]:text-ink data-[state=on]:shadow-soft',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
