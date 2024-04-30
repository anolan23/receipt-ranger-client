import { RowSelectionState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

interface UseRowSelectionArgs<TData> {
  data?: TData[];
  selectFirstOnMOunt?: boolean;
}

export function useRowSelection<T>({
  data,
  selectFirstOnMOunt,
}: UseRowSelectionArgs<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedRow = useMemo(() => {
    const index = Object.keys(rowSelection).at(0);
    if (!index) return;
    return data?.[+index];
  }, [rowSelection, data]);

  useEffect(() => {
    if (!selectFirstOnMOunt) return;
    if (!data?.length) return;
    setRowSelection({ '0': true });
  }, [data, selectFirstOnMOunt, setRowSelection]);

  return { rowSelection, setRowSelection, selectedRow };
}
