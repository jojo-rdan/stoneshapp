import { recommendationResults } from '@/domains/recommendations/recommendation.mocks';
import type { RecommendationResult } from '@/domains/recommendations/recommendation.types';

export function getRecommendationResults(): RecommendationResult[] {
  return recommendationResults;
}

export function getRecommendationForContract(contractId: string): RecommendationResult | undefined {
  return recommendationResults.find((result) => result.contractId === contractId);
}

export function formatRecommendationCost(estimatedCost: number) {
  return `${estimatedCost.toLocaleString('es-CO')} coronas`;
}

