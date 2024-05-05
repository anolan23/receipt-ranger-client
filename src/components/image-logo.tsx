import { ImgHTMLAttributes } from 'react';

interface ImageLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: number;
}

export function ImageLogo({ size = 64, ...props }: ImageLogoProps) {
  return (
    <div className={`w-[${size}px] h-[${size}px]`}>
      <img
        className="w-full h-full rounded-md bg-muted p-2 object-contain aspect-square"
        {...props}
      />
    </div>
  );
}
