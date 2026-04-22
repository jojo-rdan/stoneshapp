import { preparationPresets } from '@/domains/preparation/preparation.mocks';
import type { PreparationPreset } from '@/domains/preparation/preparation.types';
import type {
  CreatePreparationPresetInput,
  UpdatePreparationPresetInput,
} from '@/features/dungeon-prep/types/preparationPersistence.types';
import {
  createCollectionRepository,
  createLocalId,
  STORAGE_KEYS,
  STORAGE_SCHEMA_VERSION,
} from '@/shared/storage';

const presetCollectionRepository = createCollectionRepository<PreparationPreset>({
  key: STORAGE_KEYS.preparationPresets,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => preparationPresets,
});

export const preparationPresetsRepository = {
  findAll(): PreparationPreset[] {
    return presetCollectionRepository.findAll();
  },
  findById(presetId: string): PreparationPreset | undefined {
    return presetCollectionRepository.findById(presetId);
  },
  create(input: CreatePreparationPresetInput): PreparationPreset {
    return presetCollectionRepository.create({
      id: createLocalId('preset'),
      ...input,
    });
  },
  update(presetId: string, updates: UpdatePreparationPresetInput): PreparationPreset | undefined {
    return presetCollectionRepository.update(presetId, updates);
  },
  remove(presetId: string): boolean {
    return presetCollectionRepository.remove(presetId);
  },
  reset(): PreparationPreset[] {
    return presetCollectionRepository.reset();
  },
};
