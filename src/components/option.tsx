import { ImageLogo } from './image-logo';
import { cn } from '@/lib/utils';

export interface OptionItemDefinition {
  label: string;
  value: string;
  description?: string;
  imgSrc?: string;
}

interface OptionProps {
  option: OptionItemDefinition;
}

export function Option({ option, ...props }: OptionProps) {
  const { label, value, description, imgSrc } = option;
  return (
    <div
      className={cn(
        'flex items-center gap-3 overflow-hidden text-[15px] font-bold'
      )}
    >
      <ImageLogo src={imgSrc} size={40} />
      <div className="flex-1 overflow-hidden">
        <div>{label}</div>
        {description && (
          <div className="truncate text-xs font-normal text-ink-muted">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
