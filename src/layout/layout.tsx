import { HeaderLink } from '@/components/header-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Combobox } from '@/components/ui/combo-box';
import { Input } from '@/components/ui/input';
import { Outlet } from 'react-router-dom';

interface LayoutProps {}

export function Layout({ ...props }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 border-b">
        <Combobox />
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <HeaderLink to="/dashboard">Overview</HeaderLink>
          <HeaderLink to="/receipts">Receipts</HeaderLink>
          <HeaderLink to="/upload">Upload</HeaderLink>
          <HeaderLink to="/settings">Settings</HeaderLink>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Input
            className="md:w-[100px] lg:w-[300px]"
            placeholder="Search..."
          />
          <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">{<Outlet />}</main>
    </div>
  );
}
