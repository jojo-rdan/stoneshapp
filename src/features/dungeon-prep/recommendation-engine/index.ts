import { runRules } from '@/features/dungeon-prep/recommendation-engine/helpers';
import { preparationRecommendationRules } from '@/features/dungeon-prep/recommendation-engine/rules';
import type {
  PreparationRecommendationInput,
  RecommendationResult,
} from '@/features/dungeon-prep/recommendation-engine/types';

export function generatePreparationRecommendation(
  input: PreparationRecommendationInput,
): RecommendationResult {
  return runRules(input, preparationRecommendationRules);
}

export type {
  PreparationRecommendationInput,
  RecommendationAlert,
  RecommendationBucket,
  RecommendationCategory,
  RecommendationEngineVersion,
  RecommendationItem,
  RecommendationResult,
  RecommendationSeverity,
} from '@/features/dungeon-prep/recommendation-engine/types';
