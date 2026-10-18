import { DateRangePickerPreset } from '@/components/date-range-picker-preset';
import { NavButton } from '@/components/nav-button';
import {
  DatePresetValues,
  useDateRangePreset,
} from '@/hooks/use-date-range-preset';
import { Header } from '@/components/header';
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
        return 'Showing the last day';
      case '7-days':
        return 'Showing the last 7 days';
      case '1-month':
        return 'Showing the last month';
      case 'mtd':
        return 'Showing this month so far';
      case '3-months':
        return 'Showing the last 3 months';
      case '6-months':
        return 'Showing the last 6 months';
      case '1-year':
        return 'Showing the last year';
      case 'ytd':
        return 'Showing this year so far';
      case '3-years':
        return 'Showing the last 3 years';

      default:
        return null;
    }
  };

  const description = getDescription();
  return (
    <div className="grid gap-6">
    <Header
      title="Insights"
      description="See the story behind your spending."
    />
    <div className="mx-auto grid w-full min-w-0 items-start gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[300px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <DateRangePickerPreset
            dateRange={dateRange}
            onRangeSelect={setDateRange}
            datePreset={datePreset}
            onDatePresetChange={setDatePreset}
            className="w-auto"
          />
          {description && (
            <p className="text-[13px] font-bold text-ink-muted">{description}</p>
          )}
        </div>
        <nav aria-label="Insights" className="flex flex-wrap gap-2 md:flex-col md:gap-1.5">
          <NavButton to="/dashboard/analytics">Receipt insights</NavButton>
          <NavButton to="/dashboard/analytics/item-insights">
            Item insights
          </NavButton>
        </nav>
      </div>
      <div className="grid min-w-0 gap-4">
        {
          <Outlet
            context={
              { dateRange, dateInterval, datePreset } satisfies DatePresetValues
            }
          />
        }
      </div>
    </div>
    </div>
  );
}
