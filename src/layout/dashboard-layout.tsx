import { Blob } from '@/components/blob';
import { BrandMark } from '@/components/mascot';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { logout } from '@/lib/api/auth';
import { clearSWRCache, cn } from '@/lib/utils';
import {
  Camera,
  Home,
  LineChart,
  ReceiptText,
  Search,
  Smile,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  /** Label used on the phone tab bar, when different. */
  tabLabel?: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Overview', icon: Home, end: true },
  { to: '/dashboard/receipts', label: 'Receipts', icon: ReceiptText },
  { to: '/dashboard/analytics', label: 'Insights', icon: LineChart },
  {
    to: '/dashboard/settings',
    label: 'Settings',
    tabLabel: 'Me',
    icon: Smile,
  },
];

const SCAN_PATH = '/dashboard/scan';

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

  const handleLogoutSelect = function () {
    logout();
    clearSWRCache();
    navigate('/');
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

  const search = (
    <form onSubmit={handleSearchSubmit} role="search" className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-muted"
      />
      <Input
        type="search"
        aria-label="Search receipts"
        placeholder="Search merchant, category or total"
        className="pl-11 md:w-64 lg:w-80"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );

  const accountMenu = (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-12 shrink-0 rounded-full border-ink bg-blob-peach hover:bg-blob-peach"
          aria-label="Your account"
        >
          <UserRound className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogoutSelect}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="min-h-dvh bg-surface-100 text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-surface-raised focus:px-5 focus:py-3 focus:font-bold"
      >
        Skip to content
      </a>

      {/* Desktop: 224px sidebar of pill nav items and a persistent Scan button. */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col gap-1.5 bg-surface-200 px-4 py-6 md:flex">
        <Link
          to="/dashboard"
          className="mb-4 rounded-full px-2 outline-offset-4"
          aria-label="Receipt Ranger home"
        >
          <BrandMark />
        </Link>
        <nav aria-label="Main" className="flex flex-col gap-1.5">
          {NAV_ITEMS.slice(0, 3).map((item) => (
            <SideNavLink key={item.to} item={item} />
          ))}
        </nav>
        <div className="grow" />
        <SideNavLink item={NAV_ITEMS[3]} />
        <p className="mt-3 rounded-md bg-surface-raised p-3.5 text-[13px] leading-[18px] text-ink-muted">
          <span aria-hidden>💡</span> Tip: batch your receipts on Sunday. Pip
          loves a big stack!
        </p>
        <Link
          to={SCAN_PATH}
          className={cn(buttonVariants(), 'mt-3 w-full')}
        >
          <Camera aria-hidden />
          Scan a receipt
        </Link>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col md:pl-56">
        <header className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-3 px-4 pt-4 md:px-8 md:pt-6">
          <Link
            to="/dashboard"
            className="mr-auto rounded-full md:hidden"
            aria-label="Receipt Ranger home"
          >
            <BrandMark size={44} className="text-lg" />
          </Link>
          <div className="mr-auto hidden min-w-0 md:block">{breadcrumbs}</div>
          <div className="hidden md:block">{search}</div>
          {accountMenu}
          <div className="w-full md:hidden">{search}</div>
        </header>
        <main
          id="main"
          className="relative isolate flex-1 overflow-x-clip px-4 pt-5 pb-36 md:px-8 md:pt-6 md:pb-10"
        >
          <Blob
            color="peach"
            className="-top-24 -right-16 -z-10 h-72 w-72 md:-right-8 md:h-96 md:w-96"
          />
          <Blob
            color="lavender"
            className="top-40 -left-24 -z-10 hidden h-64 w-64 md:block"
          />
          {content}
        </main>
      </div>

      {/* Phone: bottom tab bar with a raised, round Scan button in the centre. */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 flex items-end justify-around border-t border-line bg-surface-raised px-1.5 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <TabLink item={NAV_ITEMS[0]} />
        <TabLink item={NAV_ITEMS[1]} />
        <NavLink
          to={SCAN_PATH}
          className="group -mt-9 flex flex-1 flex-col items-center gap-0.5 text-xs leading-4 font-bold text-ink"
        >
          <span className="grid size-[68px] place-items-center rounded-full bg-primary text-on-primary shadow-[var(--shadow-button-v),0_0_0_6px_var(--surface-raised)] transition-transform duration-[220ms] ease-bounce group-hover:-translate-y-[3px] group-hover:scale-105 group-active:translate-y-px">
            <Camera aria-hidden className="size-[30px]" />
          </span>
          Scan
        </NavLink>
        <TabLink item={NAV_ITEMS[2]} />
        <TabLink item={NAV_ITEMS[3]} />
      </nav>
    </div>
  );
}

function SideNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex min-h-12 items-center gap-3 rounded-full px-4 text-[15px] leading-none font-bold transition-[background-color,transform] duration-[220ms] ease-bounce hover:translate-x-[3px] hover:bg-surface-raised',
          isActive ? 'bg-primary-soft text-ink' : 'text-ink-muted'
        )
      }
    >
      <Icon aria-hidden className="size-[22px] shrink-0" />
      {item.label}
    </NavLink>
  );
}

function TabLink({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex min-h-12 flex-1 flex-col items-center gap-0.5 text-xs leading-4 font-bold',
          isActive ? 'text-ink' : 'text-ink-muted'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'grid h-8 w-14 place-items-center rounded-full transition-colors',
              isActive && 'bg-primary-soft'
            )}
          >
            <Icon aria-hidden className="size-[22px]" />
          </span>
          {item.tabLabel ?? item.label}
        </>
      )}
    </NavLink>
  );
}
