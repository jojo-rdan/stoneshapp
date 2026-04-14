import { useEffect } from 'react';

const THEME_STORAGE_KEY = 'stoneshapp-theme';

export function useThemeMode() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) ?? 'dark';
    document.documentElement.dataset.theme = storedTheme;
  }, []);
}

