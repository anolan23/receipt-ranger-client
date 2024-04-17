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
}

export function Select({ items, placeholder, ...props }: SelectProps) {
  return (
    <SelectPrimitive {...props}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder}>
          {items.find((item) => item.value === props.value)?.label}
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
