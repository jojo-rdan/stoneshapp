import { beforeEach, describe, expect, it } from 'vitest';
import {
  createPreparationPreset,
  deletePreparationPreset,
  getPreparationPresetById,
  getPreparationPresets,
  resetPreparationPresets,
  updatePreparationPreset,
} from '@/services/preparationService';
import { clearStoneshappStorage } from '@/test/testStorage';

describe('preparationPresetsService', () => {
  beforeEach(() => {
    clearStoneshappStorage();
  });

  it('creates, reads, updates and deletes persisted presets', () => {
    const seededPresets = resetPreparationPresets();

    const createdPreset = createPreparationPreset({
      profileId: 'profile-alden-guardia',
      name: 'Preset de prueba',
      intent: 'segura',
      description: 'Preset temporal para tests.',
      budgetEstimate: 300,
      recommendedFor: ['tests'],
      supplies: [],
      checklist: ['Revisar vendas'],
      fallbackPlan: 'Volver al pueblo.',
      runConfiguration: {
        profileId: 'profile-alden-guardia',
        level: 8,
        build: 'Guardia',
        mainWeapon: 'espada',
        usesMagic: false,
        runType: 'contrato',
        distance: 'media',
        dungeonKnown: true,
        dungeonType: 'catacumbas',
        caravanNearby: true,
        playstyle: 'seguro',
        freeSlots: 4,
      },
    });

    expect(getPreparationPresets()).toHaveLength(seededPresets.length + 1);
    expect(getPreparationPresetById(createdPreset.id)?.name).toBe('Preset de prueba');

    updatePreparationPreset(createdPreset.id, {
      name: 'Preset actualizado',
      budgetEstimate: 420,
    });

    expect(getPreparationPresetById(createdPreset.id)).toMatchObject({
      name: 'Preset actualizado',
      budgetEstimate: 420,
    });

    expect(deletePreparationPreset(createdPreset.id)).toBe(true);
    expect(getPreparationPresetById(createdPreset.id)).toBeUndefined();
  });
});
