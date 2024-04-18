import { ReactElement, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { PlusCircleIcon, Trash2Icon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

type Definition<T> = {
  label: string;
  control: (item: T, index: number) => ReactElement;
};
interface LineItemsEditorProps<T> {
  items: Array<T>;
  definition: Array<Definition<T>>;
  empty?: ReactNode;
  addButtonText?: string;
  onAddClick?: () => void;
  onRemoveClick?: (itemIndex: number) => void;
}

export const LineItemsEditor = <T,>({
  items,
  definition,
  empty = 'No items associated with the resource.',
  addButtonText = 'Add attribute',
  onAddClick,
  onRemoveClick,
}: LineItemsEditorProps<T>) => {
  const form = useFormContext();
  const renderRowControls = function (item: T, itemIndex: number) {
    return definition.map((def, index) => {
      const key = `${itemIndex}-${index}`;
      return (
        <FormField
          key={key}
          control={form.control}
          name={key}
          render={({ field }) => (
            <FormItem>
              {itemIndex === 0 ? <FormLabel>{def.label}</FormLabel> : undefined}
              <FormControl>{def.control(item, itemIndex)}</FormControl>
            </FormItem>
          )}
        />
      );
    });
  };
  const renderRow = function (item: T, index: number) {
    return (
      <div key={index} className="flex justify-end gap-2">
        <div className="flex flex-1 gap-4">
          {renderRowControls(item, index)}
        </div>
        <div>
          <Button
            type="button"
            onClick={onRemoveClick ? () => onRemoveClick(index) : undefined}
            variant="outline"
            size="icon"
            className="h-7 w-7"
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div>
      {items.length ? (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            return renderRow(item, index);
          })}
        </div>
      ) : (
        <div className="text-muted-foreground">{empty}</div>
      )}
      <div className="mt-2">
        <Button type="button" onClick={onAddClick} color="secondary">
          <PlusCircleIcon />
          {addButtonText}
        </Button>
      </div>
    </div>
  );
};
