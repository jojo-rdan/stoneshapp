import { useEffect } from 'react';
import { localStorageAdapter, STORAGE_KEYS } from '@/shared/storage';

export function useThemeMode() {
  useEffect(() => {
    const storedTheme = localStorageAdapter.getItem(STORAGE_KEYS.theme) ?? 'dark';
    document.documentElement.dataset.theme = storedTheme;
  }, []);
}
