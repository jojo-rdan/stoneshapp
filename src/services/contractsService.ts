import { contractEntries as contractEntriesMock } from '@/domains/contracts/contract.mocks';
import type { ContractEntry, ContractRegion, ContractStatus } from '@/domains/contracts/contract.types';

type ContractStatusSummary = {
  status: ContractStatus;
  label: string;
  count: number;
};

let contractStore: ContractEntry[] = contractEntriesMock.map((contract) => ({
  ...contract,
  suggestedSteps: [...contract.suggestedSteps],
  expectationsInside: [...contract.expectationsInside],
  commonMistakes: [...contract.commonMistakes],
  recommendedSupplies: [...contract.recommendedSupplies],
  enemyTags: [...contract.enemyTags],
}));

function cloneContract(contract: ContractEntry): ContractEntry {
  return {
    ...contract,
    suggestedSteps: [...contract.suggestedSteps],
    expectationsInside: [...contract.expectationsInside],
    commonMistakes: [...contract.commonMistakes],
    recommendedSupplies: [...contract.recommendedSupplies],
    enemyTags: [...contract.enemyTags],
  };
}

export function getContracts(): ContractEntry[] {
  return contractStore.map(cloneContract);
}

export function getContractById(contractId: string): ContractEntry | undefined {
  // Esta capa actua como repositorio mock para reemplazarla luego por persistencia real.
  const contract = contractStore.find((entry) => entry.id === contractId);
  return contract ? cloneContract(contract) : undefined;
}

export function getContractRegions(): ContractRegion[] {
  return [...new Set(contractStore.map((contract) => contract.region))];
}

export function getContractStatusSummary(): ContractStatusSummary[] {
  const definitions: Array<{ status: ContractStatus; label: string }> = [
    { status: 'disponible', label: 'Disponibles' },
    { status: 'seguimiento', label: 'En seguimiento' },
    { status: 'completado', label: 'Completados' },
  ];

  return definitions.map((definition) => ({
    ...definition,
    count: contractStore.filter((contract) => contract.status === definition.status).length,
  }));
}

export function updateContractStatus(contractId: string, nextStatus: ContractStatus): ContractEntry | undefined {
  contractStore = contractStore.map((contract) =>
    contract.id === contractId ? { ...contract, status: nextStatus } : contract,
  );

  return getContractById(contractId);
}

export function updateContractPersonalNotes(contractId: string, personalNotes: string): ContractEntry | undefined {
  contractStore = contractStore.map((contract) =>
    contract.id === contractId ? { ...contract, personalNotes } : contract,
  );

  return getContractById(contractId);
}

export function formatContractReward(rewardGold: number): string {
  return `${rewardGold.toLocaleString('es-CO')} coronas`;
}
