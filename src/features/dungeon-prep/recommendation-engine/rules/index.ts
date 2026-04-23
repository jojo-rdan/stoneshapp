import { buildRules } from '@/features/dungeon-prep/recommendation-engine/rules/buildRules';
import { coreSafetyRules } from '@/features/dungeon-prep/recommendation-engine/rules/coreSafetyRules';
import { dungeonRules } from '@/features/dungeon-prep/recommendation-engine/rules/dungeonRules';
import { inventoryRules } from '@/features/dungeon-prep/recommendation-engine/rules/inventoryRules';
import { playstyleRules } from '@/features/dungeon-prep/recommendation-engine/rules/playstyleRules';
import { routeRules } from '@/features/dungeon-prep/recommendation-engine/rules/routeRules';
import { runTypeRules } from '@/features/dungeon-prep/recommendation-engine/rules/runTypeRules';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const preparationRecommendationRules: RecommendationRule[] = [
  ...coreSafetyRules,
  ...buildRules,
  ...routeRules,
  ...dungeonRules,
  ...playstyleRules,
  ...inventoryRules,
  ...runTypeRules,
];
