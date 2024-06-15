import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavLink, NavLinkProps, useMatch } from 'react-router-dom';

interface NavButtonProps extends NavLinkProps {}

export function NavButton({ className, ...props }: NavButtonProps) {
  const match = useMatch(props.to.toString());

  return (
    <Button
      variant="link"
      className={cn(
        'justify-start text-inherit',
        match ? 'bg-muted hover:bg-muted hover:no-underline' : '',
        className
      )}
      asChild
    >
      <NavLink {...props}>{props.children}</NavLink>
    </Button>
  );
}
