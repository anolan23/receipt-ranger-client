import { NavLink, NavLinkProps } from 'react-router-dom';

interface HeaderLinkProps extends NavLinkProps {}

export function HeaderLink({ ...props }: HeaderLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? 'text-sm font-bold text-ink transition-colors hover:text-primary'
          : 'text-sm font-bold text-ink-muted transition-colors hover:text-primary'
      }
      {...props}
    >
      {props.children}
    </NavLink>
  );
}
