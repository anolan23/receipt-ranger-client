import { LoadingState } from '@/components/loading-state';
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
  if (loading)
    return (
      <div>
        <LoadingState pip />
      </div>
    );
  if (error)
    return (
      <ErrorLayout
        title="Oops, that was tricky to load"
        description={
          error instanceof Error ? error.message : 'Try again in a moment?'
        }
      />
    );
  if (!data) {
    return <ErrorLayout title="I couldn't find anything here" description={'Nothing to show yet.'} />;
  }
  return <div {...props}>{children(data)}</div>;
}
