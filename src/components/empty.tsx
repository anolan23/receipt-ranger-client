import { ReactNode } from 'react';

interface EmptyProps {
  children?: ReactNode;
}

export function Empty({ children, ...props }: EmptyProps) {
  return (
    <div className="p-2 h-24 text-center flex items-center justify-center">
      {children}
    </div>
  );
}
