import { contractEntries } from '@/domains/contracts/contract.mocks';
import type { ContractEntry } from '@/domains/contracts/contract.types';

export function getContracts(): ContractEntry[] {
  return contractEntries;
}

export function getContractById(contractId: string): ContractEntry | undefined {
  // En esta fase los servicios encapsulan mocks para facilitar el salto posterior a storage o API.
  return contractEntries.find((contract) => contract.id === contractId);
}

export function formatContractReward(rewardGold: number) {
  return `${rewardGold.toLocaleString('es-CO')} coronas`;
}
