import { contractEntries } from '@/domains/contracts/contract.mocks';
import type { ContractStatus } from '@/domains/contracts/contract.types';
import type {
  ContractProgressEntry,
  UpdateContractProgressInput,
} from '@/features/contracts/types/contractProgress.types';
import { createCollectionRepository, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/shared/storage';

function createProgressFromSeed(): ContractProgressEntry[] {
  const now = new Date().toISOString();

  return contractEntries.map((contract) => ({
    id: contract.id,
    contractId: contract.id,
    status: contract.status,
    personalNotes: contract.personalNotes,
    updatedAt: now,
  }));
}

const progressCollectionRepository = createCollectionRepository<ContractProgressEntry>({
  key: STORAGE_KEYS.contractsProgress,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: createProgressFromSeed,
});

function ensureProgress(contractId: string): ContractProgressEntry {
  const existingProgress = progressCollectionRepository.findById(contractId);

  if (existingProgress) {
    return existingProgress;
  }

  const matchingContract = contractEntries.find((contract) => contract.id === contractId);

  return progressCollectionRepository.create({
    id: contractId,
    contractId,
    status: matchingContract?.status ?? 'disponible',
    personalNotes: matchingContract?.personalNotes ?? '',
    updatedAt: new Date().toISOString(),
  });
}

export const contractsProgressRepository = {
  findAll(): ContractProgressEntry[] {
    return progressCollectionRepository.findAll();
  },
  findByContractId(contractId: string): ContractProgressEntry | undefined {
    return progressCollectionRepository.findById(contractId);
  },
  update(contractId: string, updates: UpdateContractProgressInput): ContractProgressEntry {
    ensureProgress(contractId);

    return progressCollectionRepository.update(contractId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    }) as ContractProgressEntry;
  },
  updateStatus(contractId: string, status: ContractStatus): ContractProgressEntry {
    return contractsProgressRepository.update(contractId, { status });
  },
  updatePersonalNotes(contractId: string, personalNotes: string): ContractProgressEntry {
    return contractsProgressRepository.update(contractId, { personalNotes });
  },
  reset(): ContractProgressEntry[] {
    return progressCollectionRepository.reset();
  },
};
