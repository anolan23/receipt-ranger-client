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
            'flex size-11 items-center justify-center rounded-full transition-colors',
            {
              'bg-primary-soft text-ink': isActive,
              'text-ink-muted hover:text-ink': !isActive,
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
