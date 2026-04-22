import type { AppSettingsState } from '@/domains/settings/settings.types';
import { appSettingsRepository } from '@/features/settings/repositories/appSettingsRepository';
import type { UpdateAppSettingsInput } from '@/features/settings/types/settingsPersistence.types';

export function getAppSettings(): AppSettingsState {
  return appSettingsRepository.get();
}

export function setAppSettings(settings: AppSettingsState): AppSettingsState {
  return appSettingsRepository.set(settings);
}

export function updateAppSettings(updates: UpdateAppSettingsInput): AppSettingsState {
  return appSettingsRepository.update(updates);
}

export function resetAppSettings(): AppSettingsState {
  return appSettingsRepository.reset();
}
