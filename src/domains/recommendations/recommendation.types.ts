import type { PreparationSupplyCategory } from '@/domains/preparation/preparation.types';

export type RecommendationPriority = 'alta' | 'media' | 'baja';

export type RecommendationRisk = 'bajo' | 'medio' | 'alto';

export type RecommendationItem = {
  id: string;
  name: string;
  quantity: string;
  category: PreparationSupplyCategory;
  priority: RecommendationPriority;
  reason: string;
};

export type RecommendationResult = {
  id: string;
  profileId: string;
  contractId: string;
  presetId: string;
  summary: string;
  readinessScore: number;
  riskAssessment: RecommendationRisk;
  estimatedCost: number;
  recommendedItems: RecommendationItem[];
  warnings: string[];
  explanation: string;
};

