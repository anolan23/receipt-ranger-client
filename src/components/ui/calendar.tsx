import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/** Pill-shaped day picker: selected days are `primary`, ranges are `primary-soft`. */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('bg-transparent p-3 [--cell-size:--spacing(11)]', className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-(--cell-size) p-0 select-none no-underline aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-(--cell-size) p-0 select-none no-underline aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-bold',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative rounded-full border-2 border-outline has-focus:border-focus',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('absolute inset-0 bg-surface-raised opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'font-display text-base font-semibold select-none',
          captionLayout === 'label'
            ? ''
            : 'flex h-8 items-center gap-1 rounded-full pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-ink-muted',
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 text-xs font-bold text-ink-muted select-none',
          defaultClassNames.weekday
        ),
        week: cn('mt-1 flex w-full', defaultClassNames.week),
        week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
        week_number: cn('text-xs text-ink-muted select-none', defaultClassNames.week_number),
        day: cn(
          'group/day relative aspect-square h-full w-full p-0 text-center select-none',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-full bg-primary-soft', defaultClassNames.range_start),
        range_middle: cn('rounded-none bg-primary-soft', defaultClassNames.range_middle),
        range_end: cn('rounded-r-full bg-primary-soft', defaultClassNames.range_end),
        today: cn('rounded-full ring-2 ring-outline ring-inset', defaultClassNames.today),
        outside: cn('text-ink-muted aria-selected:text-ink-muted', defaultClassNames.outside),
        disabled: cn('text-ink-muted opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeft className={cn('size-5', className)} {...props} />;
          }
          if (orientation === 'right') {
            return <ChevronRight className={cn('size-5', className)} {...props} />;
          }
          return <ChevronDown className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col items-center justify-center gap-1 rounded-full text-sm leading-none font-bold text-ink transition-colors hover:bg-surface-200',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-primary-soft',
        'data-[range-end=true]:bg-primary data-[range-end=true]:text-on-primary data-[range-start=true]:bg-primary data-[range-start=true]:text-on-primary data-[selected-single=true]:bg-primary data-[selected-single=true]:text-on-primary',
        'data-[range-end=true]:rounded-full data-[range-start=true]:rounded-full',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
