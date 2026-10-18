import { cn } from '@/lib/utils';

type BlobColor = 'peach' | 'butter' | 'sage' | 'lavender' | 'sky';

const COLORS: Record<BlobColor, string> = {
  peach: 'bg-blob-peach',
  butter: 'bg-blob-butter',
  sage: 'bg-blob-sage',
  lavender: 'bg-blob-lavender',
  sky: 'bg-blob-sky',
};

interface BlobProps {
  color?: BlobColor;
  className?: string;
}

/**
 * Large organic shape behind headers at 50 to 60 percent opacity. Purely
 * decorative: keep it behind headlines, never behind small text.
 */
export function Blob({ color = 'peach', className }: BlobProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute -z-0 rounded-[62%_38%_55%_45%/48%_58%_42%_52%] opacity-55',
        COLORS[color],
        className
      )}
    />
  );
}
