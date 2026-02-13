import type { ReactNode } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeProvider({ children }: { children: ReactNode }): React.ReactElement {
  // Activates theme side effects (applies class to <html>)
  useTheme();
  return <>{children}</>;
}
