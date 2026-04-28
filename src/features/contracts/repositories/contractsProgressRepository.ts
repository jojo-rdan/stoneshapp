import type { PlayerContractProgress, PlayerContractStatus } from '@/domains/contracts/contract.types';
import type {
  CreatePlayerContractProgressInput,
  UpdatePlayerContractProgressInput,
} from '@/features/contracts/types/contractProgress.types';
import {
  createCollectionRepository,
  createLocalId,
  STORAGE_KEYS,
  STORAGE_SCHEMA_VERSION,
} from '@/shared/storage';

const playerContractProgressCollection = createCollectionRepository<PlayerContractProgress>({
  key: STORAGE_KEYS.playerContractProgress,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => [],
});

export const contractsProgressRepository = {
  findAll(): PlayerContractProgress[] {
    return playerContractProgressCollection.findAll();
  },
  findById(progressId: string): PlayerContractProgress | undefined {
    return playerContractProgressCollection.findById(progressId);
  },
  findByCatalogId(contractCatalogId: string): PlayerContractProgress | undefined {
    return playerContractProgressCollection.findAll().find((entry) => entry.contractCatalogId === contractCatalogId);
  },
  create(input: CreatePlayerContractProgressInput): PlayerContractProgress {
    const existingProgress = contractsProgressRepository.findByCatalogId(input.contractCatalogId);

    if (existingProgress) {
      return existingProgress;
    }

    const timestamp = new Date().toISOString();

    return playerContractProgressCollection.create({
      id: createLocalId('player-contract'),
      contractCatalogId: input.contractCatalogId,
      status: input.status ?? 'activo',
      userNotes: input.userNotes ?? '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  },
  update(progressId: string, updates: UpdatePlayerContractProgressInput): PlayerContractProgress | undefined {
    return playerContractProgressCollection.update(progressId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },
  updateStatus(progressId: string, status: PlayerContractStatus): PlayerContractProgress | undefined {
    return contractsProgressRepository.update(progressId, { status });
  },
  updateNotes(progressId: string, userNotes: string): PlayerContractProgress | undefined {
    return contractsProgressRepository.update(progressId, { userNotes });
  },
  reset(): PlayerContractProgress[] {
    return playerContractProgressCollection.reset();
  },
};
