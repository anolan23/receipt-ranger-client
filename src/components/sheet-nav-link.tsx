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
            'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
            {
              'text-foreground': isActive,
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
