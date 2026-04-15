export type ContractRegion = 'Osbrook' | 'Mannshire' | 'Brynn';

export type ContractDungeonType = 'catacumbas' | 'fortin' | 'cripta' | 'ruinas';

export type ContractStatus = 'disponible' | 'seguimiento' | 'completado';

export type ContractPriority = 'alta' | 'media' | 'baja';

export type ContractDangerTier = 'bajo' | 'medio' | 'alto' | 'letal';

export type ContractEntry = {
  id: string;
  title: string;
  issuer: string;
  region: ContractRegion;
  locationLabel: string;
  dungeonType: ContractDungeonType;
  status: ContractStatus;
  priority: ContractPriority;
  dangerTier: ContractDangerTier;
  dangerScore: number;
  rewardGold: number;
  rewardNotes: string;
  shortDescription: string;
  explanationEs: string;
  detailedExplanationEs: string;
  tacticalSummary: string;
  suggestedSteps: string[];
  expectationsInside: string[];
  commonMistakes: string[];
  personalNotes: string;
  recommendedPresetId: string;
  recommendedSupplies: string[];
  enemyTags: string[];
};
