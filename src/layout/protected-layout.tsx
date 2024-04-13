import { HeaderLink } from '@/components/header-link';
import { Logo } from '@/components/logo';
import { LogoLink } from '@/components/logo-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Combobox } from '@/components/ui/combo-box';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { useUser } from '@/hooks/use-user';
import { useUserAttributes } from '@/hooks/use-user-attributes';
import { signOutUser } from '@/lib/api/auth';
import { clearSWRCache } from '@/lib/utils';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';

interface ProtectedLayoutProps {}

export function ProtectedLayout({ ...props }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const { data: userAttributes } = useUserAttributes();
  const [open, setOpen] = useState(false);

  const handleLogoutSelect = async function () {
    try {
      await signOutUser();
      clearSWRCache();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLinkClick = function () {
    setOpen(false);
  };

  //AWS Bug on signInDetails
  const email = userAttributes?.email;

  if (isAuthenticated === false) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center px-4 sm:px-4 md:px-8 lg:px-8 border-b fixed top-0 left-0 right-0 bg-[hsl(var(--background))] z-50">
        <div className="mr-4">
          <LogoLink />
        </div>
        {/* <Combobox value={email} /> */}

        <nav className="items-center space-x-4 lg:space-x-6 mx-6 hidden md:flex">
          <HeaderLink to="/dashboard">Overview</HeaderLink>
          <HeaderLink to="/receipts">Receipts</HeaderLink>
          <HeaderLink to="/upload">Upload</HeaderLink>
          <HeaderLink to="/settings">Settings</HeaderLink>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Input
            className="hidden md:block md:w-[200px] lg:w-[300px]"
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
              <DropdownMenuItem asChild>
                <Link to="/settings">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/goals">Goals</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/subscription">Subscription</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/appearance">Appearance</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogoutSelect}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer> */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col items-center space-y-2">
                <HeaderLink to="/dashboard" onClick={handleLinkClick}>
                  Overview
                </HeaderLink>
                <HeaderLink to="/receipts" onClick={handleLinkClick}>
                  Receipts
                </HeaderLink>
                <HeaderLink to="/upload" onClick={handleLinkClick}>
                  Upload
                </HeaderLink>
                <HeaderLink to="/settings" onClick={handleLinkClick}>
                  Settings
                </HeaderLink>
              </nav>
            </SheetContent>
          </Sheet>
          {/* <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <HamburgerMenuIcon className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <nav className="flex flex-col items-center">
                <HeaderLink to="/dashboard">Overview</HeaderLink>
                <HeaderLink to="/receipts">Receipts</HeaderLink>
                <HeaderLink to="/upload">Upload</HeaderLink>
                <HeaderLink to="/settings">Settings</HeaderLink>
              </nav>
            </CollapsibleContent>
          </Collapsible> */}
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 pt-20 sm:p-4 sm:pt-20 md:p-8 md:pt-20 lg:p-8 lg:pt-20">
        {<Outlet />}
      </main>
      <Toaster duration={10000} />
    </div>
  );
}
