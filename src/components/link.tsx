import { NavLink, NavLinkProps } from 'react-router-dom';

interface LinkProps extends NavLinkProps {}

export function Link({ ...props }: LinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? 'text-sm font-medium transition-colors hover:text-primary'
          : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
      }
      {...props}
    >
      {props.children}
    </NavLink>
  );
}
