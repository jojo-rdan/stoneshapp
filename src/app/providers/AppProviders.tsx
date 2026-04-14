import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useThemeMode } from '@/hooks/useThemeMode';

export function AppProviders({ children }: PropsWithChildren) {
  // Dejamos el tema montado en un proveedor simple para escalar luego a contexto si hace falta.
  useThemeMode();

  return <BrowserRouter>{children}</BrowserRouter>;
}
