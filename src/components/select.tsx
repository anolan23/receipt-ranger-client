import { forwardRef, useMemo } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as SelectPrimitive,
} from './ui/select';
import { SelectProps as RadixSelectProps } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';

type SelectItemDefinition = {
  label: string;
  value: string;
};

interface SelectProps extends RadixSelectProps {
  selectedItem?: SelectItemDefinition;
  items: SelectItemDefinition[];
  placeholder?: string;
  id?: any;
  sizeVariant?: 'default' | 'lg';
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ items, placeholder, id, value, sizeVariant, ...props }, ref) => {
    const selectedItem = useMemo(
      () =>
        items.find((item) => {
          return item.value === value;
        }),
      [items, value]
    );
    return (
      <SelectPrimitive value={value} {...props}>
        <SelectTrigger
          ref={ref}
          id={id}
          className={cn({ 'h-10 text-base': sizeVariant === 'lg' })}
        >
          <SelectValue placeholder={placeholder}>
            {selectedItem?.label || ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          collisionPadding={16}
          className="max-h-[var(--radix-popper-available-height)]"
        >
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>
    );
  }
);
