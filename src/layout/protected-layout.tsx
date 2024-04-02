import { HeaderLink } from '@/components/header-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Combobox } from '@/components/ui/combo-box';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/use-user';
import { useUserAttributes } from '@/hooks/use-user-attributes';
import { signOutUser } from '@/lib/api/auth';
import { clearSWRCache } from '@/lib/utils';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

interface ProtectedLayoutProps {}

export function ProtectedLayout({ ...props }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { data: userAttributes } = useUserAttributes();

  const handleLogoutSelect = async function () {
    try {
      await signOutUser();
      clearSWRCache();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  //AWS Bug on signInDetails
  const email = userAttributes?.email;

  if (isAuthenticated === false) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 border-b fixed top-0 left-0 right-0 bg-[hsl(var(--background))] z-50">
        <Combobox value={email} />
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
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>AN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Organization</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuItem>Display</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogoutSelect}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-20">{<Outlet />}</main>
    </div>
  );
}
