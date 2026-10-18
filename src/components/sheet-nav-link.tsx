import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface SheetNavLinkProps extends NavLinkProps {
  children: React.ReactNode;
}

export const SheetNavLink = forwardRef<HTMLAnchorElement, SheetNavLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <NavLink
        ref={ref}
        className={({ isActive }) => {
          return cn(
            'flex min-h-12 items-center gap-4 rounded-full px-4 font-bold text-ink-muted hover:bg-surface-200 hover:text-ink',
            {
              'bg-primary-soft text-ink': isActive,
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
