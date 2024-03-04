import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

interface HeaderLinkProps extends RouterLinkProps {}

export function Link({ ...props }: HeaderLinkProps) {
  return (
    <RouterLink
      className="text-muted-foreground underline underline-offset-4 hover:text-primary"
      {...props}
    >
      {props.children}
    </RouterLink>
  );
}
