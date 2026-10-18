import { ReactNode } from 'react';

interface ChartTooltipProps {
  title: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  swatch?: string;
}

/** Friendly tooltip that fades in above the hovered or focused mark. */
export function ChartTooltip({
  title,
  value,
  note,
  swatch,
}: ChartTooltipProps) {
  return (
    <div className="animate-fade-in rounded-md border border-outline bg-surface-raised px-3.5 py-2.5 text-ink shadow-lift">
      <div className="flex items-center gap-2 text-[13px] leading-[18px] font-bold text-ink-muted">
        {swatch && (
          <span
            aria-hidden
            className="size-3 rounded-full border-2 border-ink"
            style={{ background: swatch }}
          />
        )}
        {title}
      </div>
      <div className="num text-base leading-6 font-bold">{value}</div>
      {note && <div className="text-xs leading-4 text-ink-muted">{note}</div>}
    </div>
  );
}
