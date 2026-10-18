import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Rows are separate rounded tiles on the card ground: `border-spacing` gives
 * the gaps and the first/last cell of each row carries the rounded corners.
 */
function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn(
          'w-full border-separate border-spacing-y-1.5 text-sm leading-5',
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead className={className} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return <tfoot className={cn('font-bold', className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'group/row data-[state=selected]:[&>td]:bg-primary-soft hover:[&>td]:bg-surface-200 data-[state=selected]:hover:[&>td]:bg-primary-soft',
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'h-10 px-3.5 text-left align-middle text-xs leading-4 font-bold whitespace-nowrap text-ink-muted [&:has([role=checkbox])]:w-12',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'border-y border-line bg-surface-raised px-3.5 py-3 align-middle transition-colors duration-[120ms]',
        'first:rounded-l-md first:border-l last:rounded-r-md last:border-r',
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      className={cn('mt-4 text-sm text-ink-muted', className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
