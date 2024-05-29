import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import { Option, OptionItemDefinition } from '../option';

interface ComboboxProps {
  id?: any;
  options?: Array<OptionItemDefinition>;
  selectedOption?: OptionItemDefinition;
  placeholder?: string;
  triggerVariant?: 'label' | 'option';
  searchPlaceHolder?: string;
  empty?: ReactNode;
  filterValue?: string;
  loading?: boolean;

  onFilterChange?: (newValue: string) => void;
  onOptionChange?: (newOption: OptionItemDefinition) => void;
}
export function Combobox({
  id,
  options,
  selectedOption,
  triggerVariant = 'label',
  placeholder,
  searchPlaceHolder = 'Search resources...',
  empty = 'No resource found.',
  filterValue,
  loading,
  onFilterChange,
  onOptionChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('flex w-full justify-between', {
            'h-auto text-left': triggerVariant === 'option',
          })}
        >
          {!selectedOption?.value ? (
            placeholder
          ) : triggerVariant === 'option' ? (
            <Option option={selectedOption} />
          ) : (
            selectedOption.value
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[var(--radix-popover-content-available-height)]"
        collisionPadding={16}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceHolder}
            className="h-9 text-base"
            value={filterValue}
            onValueChange={onFilterChange}
          />
          {/* {loading && (
            <div className="py-6 flex justify-center items-center">
              <StatusIndicator status="loading">Loading</StatusIndicator>
            </div>
          )} */}
          <CommandEmpty>{empty}</CommandEmpty>
          <CommandGroup>
            {options?.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  const option = options.find((opt) => {
                    return (
                      opt.value.toLowerCase() === currentValue.toLowerCase()
                    );
                  });
                  onOptionChange && option ? onOptionChange(option) : undefined;
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Option option={option} />
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedOption?.value === option.value
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
