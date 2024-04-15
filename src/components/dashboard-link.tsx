import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface DashboardLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const DashboardLink = forwardRef<HTMLAnchorElement, DashboardLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        className={({ isActive }) => {
          return cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8',
            {
              'bg-accent text-accent-foreground': isActive,
              'text-muted-foreground hover:text-foreground': !isActive,
            }
          );
        }}
        {...props}
      >
        {children}
      </NavLink>
    );
  }
);
