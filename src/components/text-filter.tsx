import { Table } from '@tanstack/react-table';
import { Input, InputProps } from './ui/input';

interface TextFilterProps extends InputProps {
  table: Table<any>;
}

export function TextFilter({ table, ...props }: TextFilterProps) {
  return (
    <Input
      type="search"
      placeholder="Filter resources..."
      value={table.getState().globalFilter || ''}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      className="max-w-sm bg-background"
      {...props}
    />
  );
}
