import { contractEntries } from '@/domains/contracts/contract.mocks';
import type { ContractEntry, ContractRegion, ContractStatus } from '@/domains/contracts/contract.types';
import { contractsProgressRepository } from '@/features/contracts/repositories/contractsProgressRepository';
import type { ContractProgressEntry } from '@/features/contracts/types/contractProgress.types';

export type ContractStatusSummary = {
  status: ContractStatus;
  label: string;
  count: number;
};

function applyProgress(contract: ContractEntry, progress?: ContractProgressEntry): ContractEntry {
  return {
    ...contract,
    status: progress?.status ?? contract.status,
    personalNotes: progress?.personalNotes ?? contract.personalNotes,
    suggestedSteps: [...contract.suggestedSteps],
    expectationsInside: [...contract.expectationsInside],
    commonMistakes: [...contract.commonMistakes],
    recommendedSupplies: [...contract.recommendedSupplies],
    enemyTags: [...contract.enemyTags],
  };
}

export function getContracts(): ContractEntry[] {
  const progressEntries = contractsProgressRepository.findAll();

  return contractEntries.map((contract) =>
    applyProgress(
      contract,
      progressEntries.find((progress) => progress.contractId === contract.id),
    ),
  );
}

export function getContractById(contractId: string): ContractEntry | undefined {
  const contract = contractEntries.find((entry) => entry.id === contractId);

  if (!contract) {
    return undefined;
  }

  return applyProgress(contract, contractsProgressRepository.findByContractId(contractId));
}

export function getContractRegions(): ContractRegion[] {
  return [...new Set(getContracts().map((contract) => contract.region))];
}

export function getContractStatusSummary(): ContractStatusSummary[] {
  const contracts = getContracts();
  const definitions: Array<{ status: ContractStatus; label: string }> = [
    { status: 'disponible', label: 'Disponibles' },
    { status: 'seguimiento', label: 'En seguimiento' },
    { status: 'completado', label: 'Completados' },
  ];

  return definitions.map((definition) => ({
    ...definition,
    count: contracts.filter((contract) => contract.status === definition.status).length,
  }));
}

export function updateContractStatus(contractId: string, nextStatus: ContractStatus): ContractEntry | undefined {
  contractsProgressRepository.updateStatus(contractId, nextStatus);
  return getContractById(contractId);
}

export function updateContractPersonalNotes(contractId: string, personalNotes: string): ContractEntry | undefined {
  contractsProgressRepository.updatePersonalNotes(contractId, personalNotes);
  return getContractById(contractId);
}

export function resetContractsProgress(): ContractEntry[] {
  contractsProgressRepository.reset();
  return getContracts();
}

export function formatContractReward(rewardGold: number): string {
  return `${rewardGold.toLocaleString('es-CO')} coronas`;
}
