import { useEffect } from 'react';
import { getAppSettings } from '@/services/settingsService';

export function useThemeMode() {
  useEffect(() => {
    document.documentElement.dataset.theme = getAppSettings().theme;
  }, []);
}
