import type {
  PreparationDistance,
  PreparationDungeonType,
  PreparationPlaystyle,
  PreparationRunType,
  PreparationWeapon,
} from '@/domains/preparation/preparation.types';

export type RecommendationEngineVersion = 'v1';

export type RecommendationCategory =
  | 'curacion'
  | 'utilidad'
  | 'comida'
  | 'reparacion'
  | 'escape'
  | 'inventario'
  | 'magia'
  | 'combate'
  | 'seguridad';

export type RecommendationSeverity = 'baja' | 'media' | 'alta' | 'critica';

export type PreparationRecommendationInput = {
  level: number;
  buildType: string;
  mainWeapon: PreparationWeapon;
  usesMagic: boolean;
  runType: PreparationRunType;
  distance: PreparationDistance;
  dungeonKnown: boolean;
  dungeonType: PreparationDungeonType;
  caravanNearby: boolean;
  playstyle: PreparationPlaystyle;
  freeSlots: number;
};

export type RecommendationItem = {
  id: string;
  label: string;
  quantity?: string;
  severity: RecommendationSeverity;
  category: RecommendationCategory;
  explanation: string;
};

export type RecommendationAlert = {
  id: string;
  label: string;
  severity: RecommendationSeverity;
  category: RecommendationCategory;
  explanation: string;
};

export type RecommendationBucket = 'essentials' | 'recommended' | 'optional';

export type RecommendationResult = {
  engineVersion: RecommendationEngineVersion;
  summary: string;
  essentials: RecommendationItem[];
  recommended: RecommendationItem[];
  optional: RecommendationItem[];
  alerts: RecommendationAlert[];
};

export type RecommendationRule = (context: RecommendationRuleContext) => void;

export type RecommendationRuleContext = {
  input: PreparationRecommendationInput;
  addItem(bucket: RecommendationBucket, item: RecommendationItem): void;
  addAlert(alert: RecommendationAlert): void;
  addSummaryNote(note: string): void;
};
