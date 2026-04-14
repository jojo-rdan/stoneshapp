import { preparationPresets } from '@/domains/preparation/preparation.mocks';
import type { PreparationPreset } from '@/domains/preparation/preparation.types';

export function getPreparationPresets(): PreparationPreset[] {
  return preparationPresets;
}

export function getPreparationPresetById(presetId: string): PreparationPreset | undefined {
  return preparationPresets.find((preset) => preset.id === presetId);
}

