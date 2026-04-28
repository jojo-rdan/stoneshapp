export type ContractRegion = 'Osbrook' | 'Mannshire' | 'Brynn';

export type ContractObjectiveType = 'limpieza' | 'bandidos' | 'reliquia' | 'caza' | 'investigacion';

export type ContractNovicePriority = 'alta' | 'media' | 'baja' | 'evitar';

export type PlayerContractStatus = 'activo' | 'completado' | 'fallido' | 'pausado';

export type ContractCatalogEntry = {
  id: string;
  name: string;
  region: ContractRegion;
  issuerNpc: string;
  objectiveType: ContractObjectiveType;
  simpleDescription: string;
  detailedDescription: string;
  steps: string[];
  whatToExpect: string[];
  commonMistakes: string[];
  estimatedRewardGold: number;
  tags: string[];
  novicePriority?: ContractNovicePriority;
};

export type PlayerContractProgress = {
  id: string;
  contractCatalogId: string;
  status: PlayerContractStatus;
  userNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type ContractCatalogView = {
  catalog: ContractCatalogEntry;
  progress?: PlayerContractProgress;
  playerStatus: PlayerContractStatus | 'sin-seguimiento';
  isTracked: boolean;
};
