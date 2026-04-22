import { appSettingsMock } from '@/domains/settings/settings.mocks';
import type { AppSettingsState } from '@/domains/settings/settings.types';
import type { UpdateAppSettingsInput } from '@/features/settings/types/settingsPersistence.types';
import { createSingletonRepository, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/shared/storage';

const appSettingsRepositoryBase = createSingletonRepository<AppSettingsState>({
  key: STORAGE_KEYS.appSettings,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => appSettingsMock,
});

export const appSettingsRepository = {
  get(): AppSettingsState {
    return appSettingsRepositoryBase.get();
  },
  set(settings: AppSettingsState): AppSettingsState {
    return appSettingsRepositoryBase.set(settings);
  },
  update(updates: UpdateAppSettingsInput): AppSettingsState {
    return appSettingsRepositoryBase.update((current) => ({
      ...current,
      ...updates,
    }));
  },
  reset(): AppSettingsState {
    return appSettingsRepositoryBase.reset();
  },
};
