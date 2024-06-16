import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export function ImageLogo({ size = 48, ...props }: ImageLogoProps) {
  return (
    <div>
      <img
        className="rounded-md bg-muted/50 p-2 object-contain aspect-square"
        width={size}
        height={size}
        {...props}
      />
    </div>
  );
}
