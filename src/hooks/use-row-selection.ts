import { RowSelectionState } from '@tanstack/react-table';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';

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

  useLayoutEffect(() => {
    if (!selectFirstOnMOunt) return;
    if (!data?.length) return;
    setRowSelection({ '0': true });
  }, [data, selectFirstOnMOunt, setRowSelection]);

  const prevRow = function (): void {
    if (!data || data.length === 0) return;

    const selectedIndex = Object.keys(rowSelection).at(0);

    if (selectedIndex === undefined) {
      setRowSelection({ [data.length - 1]: true });
    } else {
      const currentIndex = parseInt(selectedIndex, 10);
      const prevIndex = (currentIndex - 1 + data.length) % data.length;
      setRowSelection({ [prevIndex]: true });
    }
  };

  const nextRow = function (): void {
    if (!data || data.length === 0) return;

    const selectedIndex = Object.keys(rowSelection).at(0);

    if (selectedIndex === undefined) {
      setRowSelection({ '0': true });
    } else {
      const currentIndex = parseInt(selectedIndex, 10);
      const nextIndex = (currentIndex + 1) % data.length;
      setRowSelection({ [nextIndex]: true });
    }
  };

  return { rowSelection, setRowSelection, selectedRow, prevRow, nextRow };
}
