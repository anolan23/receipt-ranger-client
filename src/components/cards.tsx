import { ReactElement, ReactNode } from 'react';
import { StatusIndicator } from './status-indicator';

interface CardsProps<TData> {
  data: TData[];
  renderCard: (data: TData) => ReactElement;
  loading?: boolean;
  loadingText?: string;
  error?: string;
  emptyText?: ReactNode;
  title?: string;
  hidden?: boolean;
}

export function Cards<TData>({
  loading,
  loadingText = 'Loading',
  error,
  emptyText = 'No resources.',
  data,
  title,
  hidden,
  renderCard,
  ...props
}: CardsProps<TData>) {
  if (hidden) return null;
  return (
    <div>
      <div className="mb-4">
        {title && <div className="text-lg font-semibold">{title}</div>}
      </div>
      <div className="grid gap-4">
        {loading ? (
          <div className="p-2 h-24 flex items-center justify-center">
            <StatusIndicator status="loading">{loadingText}</StatusIndicator>
          </div>
        ) : !data.length ? (
          <div className="p-2 h-24 text-center flex items-center justify-center">
            {emptyText}
          </div>
        ) : (
          data.map((data) => renderCard(data))
        )}
      </div>
    </div>
  );
}
