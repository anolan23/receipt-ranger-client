import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function Header({ title, description, actions, ...props }: HeaderProps) {
  return (
    <div className="flex flex-wrap justify-between gap-4">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="">{actions}</div>}
    </div>
  );
}
