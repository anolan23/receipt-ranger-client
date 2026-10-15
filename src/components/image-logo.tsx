import clsx from 'clsx';
import { StoreIcon } from 'lucide-react';
import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export function ImageLogo({
  size = 48,
  className,
  src,
  ...props
}: ImageLogoProps) {
  return (
    <div
      className={clsx(
        'relative flex items-center justify-center rounded-md bg-muted/50 p-1 object-contain aspect-square',
        className
      )}
      style={{ height: size, width: size }}
    >
      {src ? (
        <img className="rounded-md" src={src} {...props} />
      ) : (
        <StoreIcon className="h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}
