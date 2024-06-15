import { NavButton } from '@/components/nav-button';
import { Outlet } from 'react-router-dom';

interface AnalyticsContentLayoutProps {}

export function AnalyticsContentLayout({
  ...props
}: AnalyticsContentLayoutProps) {
  return (
    <div className="mx-auto grid w-full min-w-0 items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <div>
        <nav className="flex gap-4 flex-wrap lg:flex-col lg:space-x-0 lg:space-y-1">
          <NavButton to="/dashboard/analytics">Receipt insights</NavButton>
          <NavButton to="/dashboard/analytics/item-insights">
            Item insights
          </NavButton>
        </nav>
      </div>
      <div className="grid gap-8 min-w-0">{<Outlet />}</div>
    </div>
  );
}
