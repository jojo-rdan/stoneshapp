export type RunOutcome = 'exito' | 'retiro' | 'ajustar-build';

export type RunHistory = {
  id: string;
  profileId: string;
  contractId: string;
  runLabel: string;
  outcome: RunOutcome;
  dateLabel: string;
  durationMinutes: number;
  lootSummary: string;
  lessonsLearned: string[];
  consumedSupplies: string[];
  notes: string;
};

