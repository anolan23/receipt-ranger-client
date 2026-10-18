import { useLayoutEffect, useState } from 'react';

/** Phone layout (bottom tab bar, receipt cards) below the `md` breakpoint. */
export const PHONE_BREAKPOINT = 768;

export function useDeviceWidth() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < PHONE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
