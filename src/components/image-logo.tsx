import { cn } from '@/lib/utils';
import { StoreIcon } from 'lucide-react';
import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

/** Merchant logo on a small paper-white tile, like a receipt thumbnail. */
export function ImageLogo({
  size = 48,
  className,
  src,
  alt = '',
  ...props
}: ImageLogoProps) {
  return (
    <div
      className={cn(
        'relative flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-sm border-[1.5px] border-outline bg-[#fffdf8] p-1',
        className
      )}
      style={{ height: size, width: size }}
    >
      {src ? (
        <img
          className="size-full rounded-[8px] object-contain"
          src={src}
          alt={alt}
          {...props}
        />
      ) : (
        <StoreIcon aria-hidden className="size-1/2 text-[#755d56]" />
      )}
    </div>
  );
}
