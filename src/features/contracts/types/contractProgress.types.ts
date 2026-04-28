import type { PlayerContractProgress, PlayerContractStatus } from '@/domains/contracts/contract.types';

export type CreatePlayerContractProgressInput = {
  contractCatalogId: string;
  status?: PlayerContractStatus;
  userNotes?: string;
};

export type UpdatePlayerContractProgressInput = Partial<
  Pick<PlayerContractProgress, 'status' | 'userNotes'>
>;
