import { ThemeProviderContext } from '@/components/context/theme-context';
import { useContext } from 'react';

export function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}
