import { describe, expect, it } from 'vitest';
import { runRules } from '@/features/dungeon-prep/recommendation-engine/helpers';
import { dungeonRules } from '@/features/dungeon-prep/recommendation-engine/rules/dungeonRules';
import { inventoryRules } from '@/features/dungeon-prep/recommendation-engine/rules/inventoryRules';
import { playstyleRules } from '@/features/dungeon-prep/recommendation-engine/rules/playstyleRules';
import { routeRules } from '@/features/dungeon-prep/recommendation-engine/rules/routeRules';
import { createRecommendationInput } from '@/test/recommendationFixtures';

describe('recommendation-engine rules', () => {
  it('adds inventory pressure alerts for greedy runs with low free slots', () => {
    const result = runRules(
      createRecommendationInput({
        playstyle: 'arriesgado',
        freeSlots: 2,
      }),
      [...inventoryRules, ...playstyleRules],
    );

    expect(result.recommended.map((item) => item.id)).toContain('greedy-free-space');
    expect(result.essentials.map((item) => item.id)).toContain('free-slots-before-leaving');
    expect(result.alerts.map((alert) => alert.id)).toEqual(
      expect.arrayContaining(['low-free-slots', 'greedy-low-slots']),
    );
  });

  it('raises route and dungeon warnings for remote unknown crypts', () => {
    const result = runRules(
      createRecommendationInput({
        level: 5,
        distance: 'larga',
        caravanNearby: false,
        dungeonKnown: false,
        dungeonType: 'cripta',
      }),
      [...routeRules, ...dungeonRules],
    );

    expect(result.recommended.map((item) => item.id)).toEqual(
      expect.arrayContaining(['unknown-dungeon-utility-kit', 'undead-dungeon-remedy', 'long-route-water']),
    );
    expect(result.alerts.map((alert) => alert.id)).toEqual(
      expect.arrayContaining(['unknown-dungeon-alert', 'no-caravan-warning', 'low-level-crypt-risk']),
    );
  });
});
