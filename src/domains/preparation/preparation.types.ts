export type PreparationIntent = 'segura' | 'equilibrada' | 'agresiva' | 'exploracion';

export type PreparationSupplyCategory = 'curacion' | 'utilidad' | 'comida' | 'reparacion' | 'escape';

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

