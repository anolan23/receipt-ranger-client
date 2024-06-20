import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

interface InternalLinkProps extends RouterLinkProps {
  external?: false;
}

interface ExternalLinkProps {
  external: true;
  href: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
}

type LinkProps = InternalLinkProps | ExternalLinkProps;

export function Link(props: LinkProps) {
  if (props.external) {
    const {
      href,
      target = '_blank',
      rel = 'noopener noreferrer',
      ...rest
    } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className="text-muted-foreground underline underline-offset-4 hover:text-primary"
        {...rest}
      >
        {rest.children}
      </a>
    );
  }
  return (
    <RouterLink
      className="text-muted-foreground underline underline-offset-4 hover:text-primary"
      {...props}
    >
      {props.children}
    </RouterLink>
  );
}
