import { describe, expect, it } from 'vitest';
import { mapRecommendationToChecklistResult, mapRunInputToRecommendationInput } from '@/features/dungeon-prep/recommendation-engine/adapters';
import { createRecommendationInput } from '@/test/recommendationFixtures';

describe('recommendation-engine adapters', () => {
  it('maps run input to engine input preserving preparation context', () => {
    const source = {
      profileId: 'profile-test',
      level: 6,
      build: 'Explorador',
      mainWeapon: 'arco' as const,
      usesMagic: false,
      runType: 'exploracion' as const,
      distance: 'larga' as const,
      dungeonKnown: false,
      dungeonType: 'ruinas' as const,
      caravanNearby: false,
      playstyle: 'arriesgado' as const,
      freeSlots: 5,
    };

    expect(mapRunInputToRecommendationInput(source)).toEqual({
      level: 6,
      buildType: 'Explorador',
      mainWeapon: 'arco',
      usesMagic: false,
      runType: 'exploracion',
      distance: 'larga',
      dungeonKnown: false,
      dungeonType: 'ruinas',
      caravanNearby: false,
      playstyle: 'arriesgado',
      freeSlots: 5,
    });
  });

  it('maps engine output to checklist result with reasons and severities', async () => {
    const { generatePreparationRecommendation } = await import('@/features/dungeon-prep/recommendation-engine');

    const result = generatePreparationRecommendation(createRecommendationInput());
    const checklist = mapRecommendationToChecklistResult(result);

    expect(checklist.explanation).toBe(result.summary);
    expect(checklist.essentials[0]).toMatchObject({
      id: result.essentials[0]?.id,
      label: result.essentials[0]?.label,
      reason: result.essentials[0]?.explanation,
      severity: result.essentials[0]?.severity,
    });
  });
});
