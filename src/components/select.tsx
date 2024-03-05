import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as SelectPrimitive,
} from './ui/select';

type SelectItemDefinition = {
  value: string;
  label: string;
};

interface SelectProps {
  items: SelectItemDefinition[];
  placeholder?: string;
}

export function Select({ items, placeholder, ...props }: SelectProps) {
  return (
    <SelectPrimitive>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
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
