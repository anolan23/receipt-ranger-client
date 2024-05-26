import { HTMLAttributes, ReactNode } from 'react';
import { ErrorLayout } from './error-layout';

interface ContentLayoutProps<T> {
  children: (data: T) => ReactNode;
  error?: unknown;
  loading?: boolean;
  data?: T;
  className?: string;
}

export function ContentLayout<T>({
  children,
  loading,
  error,
  data,
  ...props
}: ContentLayoutProps<T>) {
  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <ErrorLayout
        title="Oops! Something went wrong"
        description={
          error instanceof Error ? error.message : 'Something went wrong'
        }
      />
    );
  if (!data) {
    return <ErrorLayout title="No data" description={'No data available'} />;
  }
  return <div {...props}>{children(data)}</div>;
}
