import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
interface DatePickerProps {
  date?: Date;
  onDateChange?: (newDate?: Date) => void;
  id?: any;
  className?: string;
}
export function DatePicker({
  date,
  onDateChange,
  id,
  className,
  ...props
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            'flex w-full max-w-[280px] justify-start text-left',
            !date && 'text-ink-muted',
            className
          )}
          id={id}
        >
          <CalendarIcon aria-hidden />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
