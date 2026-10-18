import { getCategoryStyle } from '@/lib/categories';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  label?: string | null;
  className?: string;
}

/** Filled pill in the category's fixed colour, with its emoji and name. */
export function CategoryBadge({ label, className }: CategoryBadgeProps) {
  if (!label) return <span className="text-ink-muted">-</span>;
  const style = getCategoryStyle(label);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-on-cat py-[3px] pr-3 pl-2 text-[13px] leading-5 font-bold whitespace-nowrap text-on-cat',
        style.badge,
        className
      )}
    >
      <span aria-hidden className="text-[15px] leading-none">
        {style.emoji}
      </span>
      {label}
    </span>
  );
}
