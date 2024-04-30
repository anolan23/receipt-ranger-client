import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

interface LinkProps extends RouterLinkProps {}

export function Link({ ...props }: LinkProps) {
  return (
    <RouterLink
      className="text-muted-foreground underline underline-offset-4 hover:text-primary"
      {...props}
    >
      {props.children}
    </RouterLink>
  );
}
