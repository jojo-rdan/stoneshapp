import type {
  RecommendationAlert,
  RecommendationBucket,
  RecommendationCategory,
  RecommendationItem,
  RecommendationRule,
  RecommendationSeverity,
  RecommendationResult,
  PreparationRecommendationInput,
} from '@/features/dungeon-prep/recommendation-engine/types';

type RecommendationAccumulator = {
  essentials: RecommendationItem[];
  recommended: RecommendationItem[];
  optional: RecommendationItem[];
  alerts: RecommendationAlert[];
  summaryNotes: string[];
};

export function createItem(
  id: string,
  label: string,
  category: RecommendationCategory,
  severity: RecommendationSeverity,
  explanation: string,
  quantity?: string,
): RecommendationItem {
  return {
    id,
    label,
    category,
    severity,
    explanation,
    quantity,
  };
}

export function createAlert(
  id: string,
  label: string,
  category: RecommendationCategory,
  severity: RecommendationSeverity,
  explanation: string,
): RecommendationAlert {
  return {
    id,
    label,
    category,
    severity,
    explanation,
  };
}

function addUniqueItem(target: RecommendationItem[], item: RecommendationItem) {
  if (!target.some((currentItem) => currentItem.id === item.id)) {
    target.push(item);
  }
}

function addUniqueAlert(target: RecommendationAlert[], alert: RecommendationAlert) {
  if (!target.some((currentAlert) => currentAlert.id === alert.id)) {
    target.push(alert);
  }
}

export function runRules(
  input: PreparationRecommendationInput,
  rules: RecommendationRule[],
): RecommendationResult {
  const accumulator: RecommendationAccumulator = {
    essentials: [],
    recommended: [],
    optional: [],
    alerts: [],
    summaryNotes: [],
  };

  const context = {
    input,
    addItem(bucket: RecommendationBucket, item: RecommendationItem) {
      addUniqueItem(accumulator[bucket], item);
    },
    addAlert(alert: RecommendationAlert) {
      addUniqueAlert(accumulator.alerts, alert);
    },
    addSummaryNote(note: string) {
      if (!accumulator.summaryNotes.includes(note)) {
        accumulator.summaryNotes.push(note);
      }
    },
  };

  rules.forEach((rule) => rule(context));

  return {
    engineVersion: 'v1',
    summary: buildSummary(input, accumulator.summaryNotes, accumulator.alerts),
    essentials: accumulator.essentials,
    recommended: accumulator.recommended,
    optional: accumulator.optional,
    alerts: accumulator.alerts,
  };
}

function buildSummary(
  input: PreparationRecommendationInput,
  notes: string[],
  alerts: RecommendationAlert[],
): string {
  const riskTone = alerts.some((alert) => alert.severity === 'critica' || alert.severity === 'alta')
    ? 'conviene salir con margen alto'
    : 'la salida parece manejable con preparacion ordenada';
  const dungeonKnowledge = input.dungeonKnown ? 'dungeon conocida' : 'dungeon desconocida';

  return [
    `${input.buildType} nivel ${input.level}: ${riskTone}.`,
    `Contexto: ${input.runType}, distancia ${input.distance}, ${dungeonKnowledge}.`,
    ...notes.slice(0, 3),
  ].join(' ');
}
