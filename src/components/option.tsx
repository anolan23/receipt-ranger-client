import { SettingsIcon } from 'lucide-react';
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
    <div className={cn('flex gap-2 items-center overflow-hidden text-base')}>
      <ImageLogo src={imgSrc} />
      <div className="flex-1 overflow-hidden">
        <div>{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground truncate">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
