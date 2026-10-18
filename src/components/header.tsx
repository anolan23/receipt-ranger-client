import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Screen greeting: `h1` in Fredoka with a muted line of microcopy beneath. */
export function Header({ title, description, actions }: HeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="type-h1">{title}</h1>
        {description && <p className="text-ink-muted">{description}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
