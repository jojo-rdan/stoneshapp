import { overlaySettingsMock } from '@/domains/overlay/overlay.mocks';
import type { OverlaySettings } from '@/domains/overlay/overlay.types';
import type { UpdateOverlaySettingsInput } from '@/features/overlay/types/overlayPersistence.types';
import { createSingletonRepository, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/shared/storage';

const overlaySettingsRepositoryBase = createSingletonRepository<OverlaySettings>({
  key: STORAGE_KEYS.overlaySettings,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => overlaySettingsMock,
});

export const overlaySettingsRepository = {
  get(): OverlaySettings {
    return overlaySettingsRepositoryBase.get();
  },
  set(settings: OverlaySettings): OverlaySettings {
    return overlaySettingsRepositoryBase.set(settings);
  },
  update(updates: UpdateOverlaySettingsInput): OverlaySettings {
    return overlaySettingsRepositoryBase.update((current) => ({
      ...current,
      ...updates,
    }));
  },
  reset(): OverlaySettings {
    return overlaySettingsRepositoryBase.reset();
  },
};
