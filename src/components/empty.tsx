import { ReactNode } from 'react';

interface EmptyProps {
  children?: ReactNode;
}

export function Empty({ children }: EmptyProps) {
  return (
    <div className="flex h-24 items-center justify-center p-2 text-center text-sm text-ink-muted">
      {children}
    </div>
  );
}
