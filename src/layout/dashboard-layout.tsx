import { DashboardLink } from '@/components/dashboard-link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FileBarChart2,
  FilePieChart,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ReceiptText,
  ScanText,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import placeHolderUser from '@/assets/user.webp';
import { signOutUser } from '@/lib/api/auth';
import { clearSWRCache } from '@/lib/utils';

interface DashboardLayoutProps {
  breadcrumbs?: ReactNode;
  content?: ReactNode;
}
export function DashboardLayout({
  breadcrumbs,
  content,
}: DashboardLayoutProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleLogoutSelect = async function () {
    try {
      await signOutUser();
      clearSWRCache();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit: React.FormEventHandler<HTMLFormElement> = function (
    event
  ) {
    event.preventDefault();
    if (!query.length) return;
    navigate({
      pathname: '/dashboard/receipts',
      search: `q=${query.toLowerCase()}`,
    });
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/dashboard/scanner"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <ScanText className="h-4 w-4 transition-all group-hover:scale-110" />
            {/* <Package2 className="h-4 w-4 transition-all group-hover:scale-110" /> */}
            <span className="sr-only">Scanceipt</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <DashboardLink to="/dashboard" end>
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </DashboardLink>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DashboardLink to="/dashboard/receipts">
                <ReceiptText className="h-5 w-5" />
                <span className="sr-only">Receipts</span>
              </DashboardLink>
            </TooltipTrigger>
            <TooltipContent side="right">Receipts</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DashboardLink to="/dashboard/scanner">
                <ScanText className="h-5 w-5" />
                <span className="sr-only">Scanner</span>
              </DashboardLink>
            </TooltipTrigger>
            <TooltipContent side="right">Scanner</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DashboardLink to="/dashboard/analytics">
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </DashboardLink>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <FileBarChart2 className="h-5 w-5" />
                <span className="sr-only">Reports</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Reports</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/dashboard/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/dashboard/scanner"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  {/* <Package2 className="h-5 w-5 transition-all group-hover:scale-110" /> */}
                  <ScanText className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ReceiptText className="h-5 w-5" />
                  Receipts
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ScanText className="h-5 w-5" />
                  Scanner
                </Link>
                <Link
                  to="/dashboard/analytics"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <FileBarChart2 className="h-5 w-5" />
                  Reports
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {breadcrumbs}
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form onSubmit={handleSearchSubmit}>
              <Input
                type="search"
                placeholder="Search by Merchant, Category, or total"
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src={placeHolderUser}
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogoutSelect}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{content}</main>
      </div>
    </div>
  );
}
