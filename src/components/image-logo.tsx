import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export function ImageLogo({ size = 64, ...props }: ImageLogoProps) {
  return (
    <div>
      <img
        className="rounded-md bg-muted p-2 object-contain aspect-square"
        width={size}
        height={size}
        {...props}
      />
    </div>
  );
}
