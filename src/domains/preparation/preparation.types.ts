export type PreparationIntent = 'segura' | 'equilibrada' | 'agresiva' | 'exploracion';

export type PreparationSupplyCategory = 'curacion' | 'utilidad' | 'comida' | 'reparacion' | 'escape';

export type PreparationRunType = 'contrato' | 'exploracion' | 'farmeo' | 'jefe';

export type PreparationDistance = 'corta' | 'media' | 'larga';

export type PreparationDungeonType = 'catacumbas' | 'fortin' | 'cripta' | 'ruinas' | 'cueva';

export type PreparationWeapon = 'espada' | 'hacha' | 'lanza' | 'daga' | 'arco' | 'baston';

export type PreparationPlaystyle = 'seguro' | 'equilibrado' | 'arriesgado';

export type PreparationSupplyItem = {
  id: string;
  name: string;
  quantity: string;
  category: PreparationSupplyCategory;
  reason: string;
  optional?: boolean;
};

export type PreparationPreset = {
  id: string;
  profileId: string;
  name: string;
  intent: PreparationIntent;
  description: string;
  budgetEstimate: number;
  recommendedFor: string[];
  supplies: PreparationSupplyItem[];
  checklist: string[];
  fallbackPlan: string;
};

export type PreparationRunInput = {
  profileId: string;
  level: number;
  build: string;
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

export type PreparationChecklistItem = {
  id: string;
  label: string;
  quantity?: string;
  category?: string;
  severity?: string;
  reason: string;
};

export type PreparationChecklistResult = {
  essentials: PreparationChecklistItem[];
  recommended: PreparationChecklistItem[];
  optional: PreparationChecklistItem[];
  alerts: string[];
  explanation: string;
};
