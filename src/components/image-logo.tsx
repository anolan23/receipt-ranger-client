import clsx from 'clsx';
import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export function ImageLogo({ size = 48, className, ...props }: ImageLogoProps) {
  return (
    <div
      className={clsx(
        'relative flex rounded-md bg-muted/50 p-1 object-contain aspect-square',
        className
      )}
      style={{ height: size, width: size }}
    >
      <img className="rounded-md" {...props} />
    </div>
  );
}
