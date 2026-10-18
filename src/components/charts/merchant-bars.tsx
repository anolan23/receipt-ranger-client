import { LoadingState } from '@/components/loading-state';
import { cn } from '@/lib/utils';

export interface MerchantBar {
  name: string;
  count: number;
}

interface MerchantBarsProps {
  data: MerchantBar[];
  /** How many merchants to show. */
  limit?: number;
  loading?: boolean;
  className?: string;
}

/** Ranked merchants: butter rank circle, name, and a peach bar that grows in from the left. */
export function MerchantBars({ data, limit = 6, loading, className }: MerchantBarsProps) {
  const rows = [...data].sort((a, b) => b.count - a.count).slice(0, limit);
  const max = Math.max(1, ...rows.map((row) => row.count));

  if (loading) return <LoadingState className={className} />;

  if (!rows.length) {
    return (
      <p className="py-6 text-center text-sm text-ink-muted">
        Scan a few receipts and your favourite stores will show up here.
      </p>
    );
  }

  return (
    <ol className={cn('grid gap-3', className)}>
      {rows.map((row, index) => (
        <li
          key={row.name}
          className="grid grid-cols-[28px_1fr_auto] items-center gap-x-3 gap-y-1"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-full border-[1.5px] border-ink bg-blob-butter text-[13px] font-bold text-ink"
          >
            {index + 1}
          </span>
          <span className="truncate text-sm font-bold">{row.name}</span>
          <span className="num text-sm font-bold">
            {row.count} {row.count === 1 ? 'visit' : 'visits'}
          </span>
          <div className="col-span-2 col-start-2 h-3.5 rounded-[7px] bg-surface-200">
            <div
              className="h-full origin-left animate-grow-x rounded-[7px] border-2 border-ink bg-blob-peach"
              style={{ width: `${Math.max(6, (row.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
