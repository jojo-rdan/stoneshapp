import { contractCatalog } from '@/content/contracts/contractCatalog';
import type {
  ContractCatalogEntry,
  ContractCatalogView,
  ContractRegion,
  PlayerContractProgress,
  PlayerContractStatus,
} from '@/domains/contracts/contract.types';
import { contractsProgressRepository } from '@/features/contracts/repositories/contractsProgressRepository';

export type ContractStatusSummary = {
  status: PlayerContractStatus;
  label: string;
  count: number;
};

function buildContractView(
  catalogEntry: ContractCatalogEntry,
  progress?: PlayerContractProgress,
): ContractCatalogView {
  return {
    catalog: {
      ...catalogEntry,
      steps: [...catalogEntry.steps],
      whatToExpect: [...catalogEntry.whatToExpect],
      commonMistakes: [...catalogEntry.commonMistakes],
      tags: [...catalogEntry.tags],
    },
    progress: progress
      ? {
          ...progress,
        }
      : undefined,
    playerStatus: progress?.status ?? 'sin-seguimiento',
    isTracked: Boolean(progress),
  };
}

function getStatusLabel(status: PlayerContractStatus): string {
  if (status === 'activo') {
    return 'Activos';
  }

  if (status === 'pausado') {
    return 'Pausados';
  }

  if (status === 'completado') {
    return 'Completados';
  }

  return 'Fallidos';
}

export function getContractCatalog(): ContractCatalogEntry[] {
  return contractCatalog.map((entry) => ({
    ...entry,
    steps: [...entry.steps],
    whatToExpect: [...entry.whatToExpect],
    commonMistakes: [...entry.commonMistakes],
    tags: [...entry.tags],
  }));
}

export function getContractCatalogById(contractCatalogId: string): ContractCatalogEntry | undefined {
  return getContractCatalog().find((entry) => entry.id === contractCatalogId);
}

export function getContractCatalogViews(): ContractCatalogView[] {
  const progressEntries = contractsProgressRepository.findAll();

  return getContractCatalog().map((entry) =>
    buildContractView(
      entry,
      progressEntries.find((progress) => progress.contractCatalogId === entry.id),
    ),
  );
}

export function getContractViewById(contractCatalogId: string): ContractCatalogView | undefined {
  const catalogEntry = getContractCatalogById(contractCatalogId);

  if (!catalogEntry) {
    return undefined;
  }

  return buildContractView(catalogEntry, contractsProgressRepository.findByCatalogId(contractCatalogId));
}

export function getContractRegions(): ContractRegion[] {
  return [...new Set(contractCatalog.map((entry) => entry.region))];
}

export function getPlayerContractProgressEntries(): PlayerContractProgress[] {
  return contractsProgressRepository.findAll();
}

export function getActivePlayerContracts(): ContractCatalogView[] {
  return getContractCatalogViews().filter(
    (entry) => entry.progress && (entry.progress.status === 'activo' || entry.progress.status === 'pausado'),
  );
}

export function getTrackedContractViews(): ContractCatalogView[] {
  return getContractCatalogViews().filter((entry) => entry.isTracked);
}

export function getContractStatusSummary(): ContractStatusSummary[] {
  const progressEntries = getPlayerContractProgressEntries();
  const definitions: PlayerContractStatus[] = ['activo', 'pausado', 'completado', 'fallido'];

  return definitions.map((status) => ({
    status,
    label: getStatusLabel(status),
    count: progressEntries.filter((entry) => entry.status === status).length,
  }));
}

export function createPlayerContractFromCatalog(contractCatalogId: string): ContractCatalogView | undefined {
  const catalogEntry = getContractCatalogById(contractCatalogId);

  if (!catalogEntry) {
    return undefined;
  }

  contractsProgressRepository.create({
    contractCatalogId,
    status: 'activo',
  });

  return getContractViewById(contractCatalogId);
}

export function updatePlayerContractStatus(
  contractCatalogId: string,
  nextStatus: PlayerContractStatus,
): ContractCatalogView | undefined {
  const progress = contractsProgressRepository.findByCatalogId(contractCatalogId);

  if (!progress) {
    const createdView = createPlayerContractFromCatalog(contractCatalogId);

    if (!createdView?.progress) {
      return createdView;
    }

    contractsProgressRepository.updateStatus(createdView.progress.id, nextStatus);
    return getContractViewById(contractCatalogId);
  }

  contractsProgressRepository.updateStatus(progress.id, nextStatus);
  return getContractViewById(contractCatalogId);
}

export function updatePlayerContractNotes(
  contractCatalogId: string,
  userNotes: string,
): ContractCatalogView | undefined {
  const progress = contractsProgressRepository.findByCatalogId(contractCatalogId);

  if (!progress) {
    const createdProgress = contractsProgressRepository.create({
      contractCatalogId,
      status: 'activo',
      userNotes,
    });

    return getContractViewById(createdProgress.contractCatalogId);
  }

  contractsProgressRepository.updateNotes(progress.id, userNotes);
  return getContractViewById(contractCatalogId);
}

export function resetContractsProgress(): ContractCatalogView[] {
  contractsProgressRepository.reset();
  return getContractCatalogViews();
}

export function formatContractReward(estimatedRewardGold: number): string {
  return `${estimatedRewardGold.toLocaleString('es-CO')} coronas`;
}
