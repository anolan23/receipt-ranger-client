import { ReactElement, ReactNode } from 'react';
import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';

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
  loadingText = 'Counting the coupons…',
  emptyText = 'Nothing here yet.',
  data,
  title,
  hidden,
  renderCard,
}: CardsProps<TData>) {
  if (hidden) return null;
  return (
    <section>
      {title && <h2 className="type-h3 mb-3">{title}</h2>}
      <div className="grid gap-2">
        {loading ? (
          <LoadingState label={loadingText} />
        ) : !data.length ? (
          <EmptyState title={String(emptyText)} className="rounded-md bg-surface-raised" />
        ) : (
          data.map((data) => renderCard(data))
        )}
      </div>
    </section>
  );
}
