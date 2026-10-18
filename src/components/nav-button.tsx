import { cn } from '@/lib/utils';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface NavButtonProps extends Omit<NavLinkProps, 'className'> {
  className?: string;
}

/** Pill sub-navigation item. The current page is `primary-soft`. */
export function NavButton({ className, ...props }: NavButtonProps) {
  return (
    <NavLink
      end
      className={({ isActive }) =>
        cn(
          'inline-flex min-h-11 items-center rounded-full px-4 text-[15px] leading-none font-bold transition-[background-color,transform] duration-[220ms] ease-bounce hover:translate-x-[3px] hover:bg-surface-raised',
          isActive ? 'bg-primary-soft text-ink' : 'text-ink-muted',
          className
        )
      }
      {...props}
    >
      {props.children}
    </NavLink>
  );
}
