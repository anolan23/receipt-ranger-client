import { useLayoutEffect, useState } from 'react';

export function useDeviceWidth() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
