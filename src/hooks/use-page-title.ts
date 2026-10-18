import { useLayoutEffect } from 'react';

export function usePageTitle(title: string) {
  useLayoutEffect(() => {
    document.title = `${title} | Receipt Ranger`;
  }, [title]);
}
