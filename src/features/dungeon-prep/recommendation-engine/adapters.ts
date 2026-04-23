import type { PreparationChecklistResult } from '@/domains/preparation/preparation.types';
import type {
  PreparationRecommendationInput,
  RecommendationItem,
  RecommendationResult,
} from '@/features/dungeon-prep/recommendation-engine/types';
import type { PreparationRunInput } from '@/domains/preparation/preparation.types';

function mapRecommendationItem(item: RecommendationItem) {
  return {
    id: item.id,
    label: item.label,
    quantity: item.quantity,
    category: item.category,
    severity: item.severity,
    reason: item.explanation,
  };
}

export function mapRunInputToRecommendationInput(input: PreparationRunInput): PreparationRecommendationInput {
  return {
    level: input.level,
    buildType: input.build,
    mainWeapon: input.mainWeapon,
    usesMagic: input.usesMagic,
    runType: input.runType,
    distance: input.distance,
    dungeonKnown: input.dungeonKnown,
    dungeonType: input.dungeonType,
    caravanNearby: input.caravanNearby,
    playstyle: input.playstyle,
    freeSlots: input.freeSlots,
  };
}

export function mapRecommendationToChecklistResult(result: RecommendationResult): PreparationChecklistResult {
  return {
    essentials: result.essentials.map(mapRecommendationItem),
    recommended: result.recommended.map(mapRecommendationItem),
    optional: result.optional.map(mapRecommendationItem),
    alerts: result.alerts.map((alert) => `${alert.label} ${alert.explanation}`),
    explanation: result.summary,
  };
}
