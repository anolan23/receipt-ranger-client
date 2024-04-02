import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, Outlet } from 'react-router-dom';
import { NavButton } from './components/nav-button';

interface SettingsPageProps {}

export function SettingsPage({ ...props }: SettingsPageProps) {
  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="w-full" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5 lg:max-w-[250px]">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <NavButton to="/settings">Profile</NavButton>
            <NavButton to="/settings/organization">Organization</NavButton>
            <NavButton to="/settings/subscription">Subscription</NavButton>
            <NavButton to="/settings/appearance">Appearance</NavButton>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
