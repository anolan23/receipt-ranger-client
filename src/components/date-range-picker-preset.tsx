import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DatePreset } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface DateRangePickerPresetProps {
  className?: string;
  dateRange?: DateRange;
  datePreset?: DatePreset;
  onRangeSelect?: (range: DateRange | undefined) => void;
  onDatePresetChange?: (preset: DatePreset) => void;
}

export function DateRangePickerPreset({
  className,
  dateRange = {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  },
  datePreset,
  onDatePresetChange,
  onRangeSelect,
}: DateRangePickerPresetProps) {
  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="secondary"
            className={cn(
              'w-full justify-start text-left sm:w-[300px]',
              !dateRange && 'text-ink-muted',
              className
            )}
          >
            <CalendarIcon aria-hidden />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} -{' '}
                  {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          collisionPadding={32}
        >
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onRangeSelect}
            numberOfMonths={2}
          />
          <div className="max-w-[520px] space-y-2 border-t border-dashed border-line p-4">
            <Label>Or pick a quick range</Label>
            <ToggleGroup
              type="single"
              value={datePreset}
              onValueChange={onDatePresetChange}
              className="flex flex-wrap justify-start rounded-md"
            >
              <ToggleGroupItem value="1-day">1 Day</ToggleGroupItem>
              <ToggleGroupItem value="7-days">7 Days</ToggleGroupItem>
              <ToggleGroupItem value="mtd">Month to Date</ToggleGroupItem>
              <ToggleGroupItem value="1-month">1 Month</ToggleGroupItem>
              <ToggleGroupItem value="3-months">3 Months</ToggleGroupItem>
              <ToggleGroupItem value="6-months">6 Months</ToggleGroupItem>
              <ToggleGroupItem value="1-year">1 Year</ToggleGroupItem>
              <ToggleGroupItem value="3-years">3 Years</ToggleGroupItem>
              <ToggleGroupItem value="ytd">Year to Date</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
