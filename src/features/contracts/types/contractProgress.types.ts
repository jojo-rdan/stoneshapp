import type { ContractStatus } from '@/domains/contracts/contract.types';

export type ContractProgressEntry = {
  id: string;
  contractId: string;
  status: ContractStatus;
  personalNotes: string;
  updatedAt: string;
};

export type UpdateContractProgressInput = Partial<Pick<ContractProgressEntry, 'status' | 'personalNotes'>>;
