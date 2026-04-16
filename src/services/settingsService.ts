import { appSettingsMock } from '@/domains/settings/settings.mocks';
import type { AppSettingsState } from '@/domains/settings/settings.types';

export function getAppSettings(): AppSettingsState {
  return appSettingsMock;
}
