import { Header } from '@/components/header';
import { Separator } from '@/components/ui/separator';
import { Outlet } from 'react-router-dom';
import { NavButton } from './components/nav-button';
import { DashboardLayout } from '@/layout/dashboard-layout';
import SmartBreadcrumb from '@/components/smart-breadcrumb';

interface SettingsPageProps {}

export function SettingsPage({ ...props }: SettingsPageProps) {
  return (
    <DashboardLayout
      breadcrumbs={<SmartBreadcrumb />}
      content={
        <div className="space-y-6 pb-16">
          <Header
            title="Settings"
            description="Manage your account settings and set e-mail preferences."
          />
          <Separator className="w-full" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5 lg:max-w-[250px]">
              <nav className="flex gap-2 flex-wrap lg:flex-col lg:space-x-0 lg:space-y-1">
                <NavButton to="/dashboard-test/settings">Profile</NavButton>
                <NavButton to="/dashboard-test/settings/goals">Goals</NavButton>
                <NavButton to="/dashboard-test/settings/subscription">
                  Subscription
                </NavButton>
                <NavButton to="/dashboard-test/settings/appearance">
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
