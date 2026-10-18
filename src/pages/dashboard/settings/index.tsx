import { Header } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import { Outlet } from 'react-router-dom';
import { NavButton } from '../../../components/nav-button';
import { DashboardLayout } from '@/layout/dashboard-layout';
import SmartBreadcrumb from '@/components/smart-breadcrumb';
import { usePageTitle } from '@/hooks/use-page-title';

interface SettingsPageProps {}

export function SettingsPage({ ...props }: SettingsPageProps) {
  usePageTitle('Settings');
  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-6 pb-16">
          <Header
            title="Settings"
            description="Make Receipt Ranger work the way you like."
          />
          <Separator />
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <aside className="lg:w-1/5 lg:max-w-[250px]">
              <nav aria-label="Settings" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1.5">
                <NavButton to="/dashboard/settings">Profile</NavButton>
                <NavButton to="/dashboard/settings/goals">Goal</NavButton>
                <NavButton to="/dashboard/settings/subscription">
                  Subscription
                </NavButton>
                <NavButton to="/dashboard/settings/appearance">
                  Appearance
                </NavButton>
              </nav>
            </aside>
            <div className="flex-1 lg:max-w-3xl">
              <Outlet />
            </div>
          </div>
        </div>
      }
    />
  );
}
