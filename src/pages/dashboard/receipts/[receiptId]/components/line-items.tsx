import { DollarInput } from "@/components/dollar-input";
import { LineItem } from "@/components/line-item";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ItemSeparator } from "@/components/ui/item";
import { ReceiptData, SubcategoryData } from "@/lib/types";
import { Plus } from "lucide-react";
import { Fragment, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EditReceiptFormValues } from "../interfaces";
import { useDeviceWidth } from "@/hooks/use-device-width";

interface LineItemsProps {
  receipt: ReceiptData;
  subcategories?: SubcategoryData[];
}

export function LineItems({
  receipt,
  subcategories,
  ...props
}: LineItemsProps) {
  const { control, watch } = useFormContext<EditReceiptFormValues>();
  const { fields, append, remove } = useFieldArray<EditReceiptFormValues>({
    control,
    name: "items",
  });

  const selectItems = useMemo(() => {
    return (
      subcategories?.map((cat) => {
        return {
          label: cat.name,
          value: cat.id.toString(),
        };
      }) || []
    );
  }, [subcategories]);

  const addItem = () => append({ name: "Enter Item name", quantity: 1 });

  return (
    <section aria-labelledby="line-items-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="line-items-heading" className="text-sm font-semibold">
          Items{" "}
          <span className="ml-1 font-normal tabular-nums text-muted-foreground">
            ({fields.length})
          </span>
        </h2>
        {fields.length ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-mr-2 h-8 gap-1"
            onClick={addItem}
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </Button>
        ) : null}
      </div>
      {!fields.length ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center">
          <p className="text-sm font-medium">No items on this receipt</p>
          <p className="text-xs text-muted-foreground">
            Add them to track what you bought, or skip this if you only need the
            total.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1 gap-1"
            onClick={addItem}
          >
            <Plus className="h-3.5 w-3.5" />
            Add item
          </Button>
        </div>
      ) : (
        <ul className="min-w-0 overflow-hidden rounded-lg border bg-background">
          {fields?.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && (
                <li role="presentation">
                  <ItemSeparator />
                </li>
              )}
              <LineItem
                variant="edit"
                name={watch(`items.${index}.name`)}
                quantity={watch(`items.${index}.quantity`)}
                price={watch(`items.${index}.price`)}
                subcategory={
                  subcategories?.find(
                    (sub) => sub.id == watch(`items.${index}.subcategory_id`),
                  )?.name
                }
                onRemoveClick={() => remove(index)}
                content={
                  <>
                    <FormField
                      control={control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">Item name</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Item name"
                              // value={field.value || ''}
                              value={field.value || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`items.${index}.subcategory_id`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel htmlFor="subcategory">
                              Category
                            </FormLabel>
                            <FormControl>
                              <Select
                                id="subcategory"
                                placeholder="Select Item Category"
                                items={selectItems}
                                value={field.value?.toString()}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                disabled={!subcategories?.length}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="quantity">Quantity</FormLabel>
                            <FormControl>
                              <Input
                                id="quantity"
                                type="number"
                                inputMode="numeric"
                                value={field.value}
                                onChange={field.onChange}
                                min={1}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="price">Total price</FormLabel>
                            <FormControl>
                              <DollarInput
                                id="price"
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="text-right tabular-nums"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                }
              />
            </Fragment>
          ))}
        </ul>
      )}
    </section>
  );
}
