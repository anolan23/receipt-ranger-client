import { Table } from '@tanstack/react-table';
import { Input } from './ui/input';

interface TextFilterProps extends React.ComponentProps<'input'> {
  table: Table<any>;
}

export function TextFilter({ table, ...props }: TextFilterProps) {
  return (
    <Input
      type="search"
      placeholder="Filter resources..."
      value={table.getState().globalFilter || ''}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      className="max-w-sm bg-background h-8 w-[150px] lg:w-[250px]"
      {...props}
    />
  );
}
