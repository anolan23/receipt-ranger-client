import { RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

interface UseRowSelectionArgs<TData> {
  data?: TData[];
}

export function useRowSelection<T>({ data }: UseRowSelectionArgs<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRow = useMemo(() => {
    const index = Object.keys(rowSelection).at(0);
    if (!index) return;
    return data?.[+index];
  }, [rowSelection, data]);

  return { rowSelection, setRowSelection, selectedRow };
}
