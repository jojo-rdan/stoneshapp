import type { PreparationPreset } from '@/domains/preparation/preparation.types';
import { preparationPresetsRepository } from '@/features/dungeon-prep/repositories/preparationPresetsRepository';
import type {
  CreatePreparationPresetInput,
  UpdatePreparationPresetInput,
} from '@/features/dungeon-prep/types/preparationPersistence.types';

export function getPreparationPresets(): PreparationPreset[] {
  return preparationPresetsRepository.findAll();
}

export function getPreparationPresetById(presetId: string): PreparationPreset | undefined {
  return preparationPresetsRepository.findById(presetId);
}

export function createPreparationPreset(input: CreatePreparationPresetInput): PreparationPreset {
  return preparationPresetsRepository.create(input);
}

export function updatePreparationPreset(
  presetId: string,
  updates: UpdatePreparationPresetInput,
): PreparationPreset | undefined {
  return preparationPresetsRepository.update(presetId, updates);
}

export function deletePreparationPreset(presetId: string): boolean {
  return preparationPresetsRepository.remove(presetId);
}

export function resetPreparationPresets(): PreparationPreset[] {
  return preparationPresetsRepository.reset();
}
