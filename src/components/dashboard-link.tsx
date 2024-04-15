import { cn } from '@/lib/utils';
import {
  NavLink as NavLinkPrimitive,
  NavLinkProps as NavLinkPrimitiveProps,
} from 'react-router-dom';

interface DashboardLinkProps extends NavLinkPrimitiveProps {}

export function DashboardLink({ ...props }: DashboardLinkProps) {
  return (
    <NavLinkPrimitive
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
      {props.children}
    </NavLinkPrimitive>
  );
}
