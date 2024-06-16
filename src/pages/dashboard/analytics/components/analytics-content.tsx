import { DateRangePickerPreset } from '@/components/date-range-picker-preset';
import { NavButton } from '@/components/nav-button';
import {
  DatePresetValues,
  useDateRangePreset,
} from '@/hooks/use-date-range-preset';
import { Outlet } from 'react-router-dom';

interface AnalyticsContentLayoutProps {}

export function AnalyticsContentLayout({
  ...props
}: AnalyticsContentLayoutProps) {
  const { datePreset, dateRange, dateInterval, setDatePreset, setDateRange } =
    useDateRangePreset('6-months');
  const getDescription = function () {
    switch (datePreset) {
      case '1-day':
        return 'Displaying last 1 day';
      case '7-days':
        return 'Displaying last 7 days';
      case '1-month':
        return 'Displaying last 1 month';
      case 'mtd':
        return 'Displaying month to date';
      case '3-months':
        return 'Displaying last 3 months';
      case '6-months':
        return 'Displaying last 6 months';
      case '1-year':
        return 'Displaying last 1 year';
      case 'ytd':
        return 'Displaying year to date';
      case '3-years':
        return 'Displaying last 3 years';

      default:
        return null;
    }
  };

  const description = getDescription();
  return (
    <div className="mx-auto grid w-full min-w-0 items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <DateRangePickerPreset
            dateRange={dateRange}
            onRangeSelect={setDateRange}
            datePreset={datePreset}
            onDatePresetChange={setDatePreset}
            className="w-auto"
          />
          {description && (
            <p className="text-[0.8rem] text-muted-foreground">{description}</p>
          )}
        </div>
        <nav className="flex gap-4 flex-wrap lg:flex-col lg:space-x-0 lg:space-y-1">
          <NavButton to="/dashboard/analytics">Receipt insights</NavButton>
          <NavButton to="/dashboard/analytics/item-insights">
            Item insights
          </NavButton>
        </nav>
      </div>
      <div className="grid gap-8 min-w-0">
        {
          <Outlet
            context={
              { dateRange, dateInterval, datePreset } satisfies DatePresetValues
            }
          />
        }
      </div>
    </div>
  );
}
