import type { PreparationRecommendationInput } from '@/features/dungeon-prep/recommendation-engine';

export function createRecommendationInput(
  overrides: Partial<PreparationRecommendationInput> = {},
): PreparationRecommendationInput {
  return {
    level: 8,
    buildType: 'Guardia de prueba',
    mainWeapon: 'espada',
    usesMagic: false,
    runType: 'contrato',
    distance: 'media',
    dungeonKnown: true,
    dungeonType: 'catacumbas',
    caravanNearby: true,
    playstyle: 'equilibrado',
    freeSlots: 4,
    ...overrides,
  };
}
