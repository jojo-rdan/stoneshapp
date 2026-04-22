import type { OverlaySettings } from '@/domains/overlay/overlay.types';
import { overlaySettingsRepository } from '@/features/overlay/repositories/overlaySettingsRepository';
import type { UpdateOverlaySettingsInput } from '@/features/overlay/types/overlayPersistence.types';

export function getOverlaySettings(): OverlaySettings {
  return overlaySettingsRepository.get();
}

export function setOverlaySettings(settings: OverlaySettings): OverlaySettings {
  return overlaySettingsRepository.set(settings);
}

export function updateOverlaySettings(updates: UpdateOverlaySettingsInput): OverlaySettings {
  return overlaySettingsRepository.update(updates);
}

export function resetOverlaySettings(): OverlaySettings {
  return overlaySettingsRepository.reset();
}
