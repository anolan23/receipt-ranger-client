import { forwardRef, useMemo } from 'react';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as SelectPrimitive,
} from './ui/select';
import { SelectProps as RadixSelectProps } from '@radix-ui/react-select';

type SelectItemDefinition = {
  label: string;
  value: string;
};

interface SelectProps extends RadixSelectProps {
  items: SelectItemDefinition[];
  placeholder?: string;
  id?: any;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ items, placeholder, id, value, ...props }, ref) => {
    const selectedItem = useMemo(
      () =>
        items.find((item) => {
          return item.value === value;
        }),
      [items, value]
    );
    return (
      <SelectPrimitive value={value} {...props}>
        <SelectTrigger ref={ref} id={id}>
          <SelectValue placeholder={placeholder}>
            {selectedItem?.label || ''}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
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
