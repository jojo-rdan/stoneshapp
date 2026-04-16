import { overlaySettingsMock } from '@/domains/overlay/overlay.mocks';
import type { OverlaySettings } from '@/domains/overlay/overlay.types';

export function getOverlaySettings(): OverlaySettings {
  return overlaySettingsMock;
}
