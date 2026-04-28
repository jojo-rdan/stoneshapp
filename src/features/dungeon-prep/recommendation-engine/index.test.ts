import { describe, expect, it } from 'vitest';
import { generatePreparationRecommendation } from '@/features/dungeon-prep/recommendation-engine';
import { createRecommendationInput } from '@/test/recommendationFixtures';

describe('generatePreparationRecommendation', () => {
  it('builds a conservative checklist for low level unknown dungeons with no caravan', () => {
    const result = generatePreparationRecommendation(
      createRecommendationInput({
        level: 4,
        dungeonKnown: false,
        dungeonType: 'cripta',
        caravanNearby: false,
        distance: 'larga',
        freeSlots: 2,
      }),
    );

    expect(result.engineVersion).toBe('v1');
    expect(result.essentials.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        'bandages-base',
        'food-base',
        'low-level-safety-buffer',
        'unknown-dungeon-scouting-buffer',
        'long-route-rations',
        'no-caravan-retreat-plan',
        'free-slots-before-leaving',
      ]),
    );
    expect(result.alerts.map((alert) => alert.id)).toEqual(
      expect.arrayContaining([
        'low-level-risk',
        'unknown-dungeon-alert',
        'low-level-crypt-risk',
        'no-caravan-warning',
        'low-free-slots',
      ]),
    );
    expect(result.summary).toContain('dungeon desconocida');
  });

  it('adds sustain and boss tools for magic-focused boss runs', () => {
    const result = generatePreparationRecommendation(
      createRecommendationInput({
        mainWeapon: 'baston',
        usesMagic: true,
        runType: 'jefe',
        playstyle: 'seguro',
      }),
    );

    expect(result.essentials.map((item) => item.id)).toEqual(
      expect.arrayContaining(['bandages-base', 'food-base', 'safe-playstyle-buffer', 'boss-burst-safety']),
    );
    expect(result.recommended.map((item) => item.id)).toEqual(
      expect.arrayContaining(['caster-energy-sustain', 'caster-safe-retreat', 'boss-offensive-tool']),
    );
    expect(result.summary).toContain('Salida de jefe');
  });
});
