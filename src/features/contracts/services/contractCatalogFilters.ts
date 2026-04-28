import type { ContractCatalogView, ContractRegion, PlayerContractStatus } from '@/domains/contracts/contract.types';

export type ContractViewMode = 'catalogo' | 'activos' | 'seguimiento';

export type ContractStatusFilter = 'todos' | 'sin-seguimiento' | PlayerContractStatus;

type FilterContractCatalogViewsInput = {
  contracts: ContractCatalogView[];
  viewMode: ContractViewMode;
  searchQuery: string;
  selectedStatus: ContractStatusFilter;
  selectedRegion: 'todos' | ContractRegion;
};

function filterByViewMode(contracts: ContractCatalogView[], viewMode: ContractViewMode): ContractCatalogView[] {
  if (viewMode === 'activos') {
    return contracts.filter(
      (contract) =>
        contract.progress && (contract.progress.status === 'activo' || contract.progress.status === 'pausado'),
    );
  }

  if (viewMode === 'seguimiento') {
    return contracts.filter((contract) => contract.isTracked);
  }

  return contracts;
}

export function filterContractCatalogViews({
  contracts,
  viewMode,
  searchQuery,
  selectedStatus,
  selectedRegion,
}: FilterContractCatalogViewsInput): ContractCatalogView[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const scopedContracts = filterByViewMode(contracts, viewMode);

  return scopedContracts.filter((contract) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      contract.catalog.name.toLowerCase().includes(normalizedQuery) ||
      contract.catalog.issuerNpc.toLowerCase().includes(normalizedQuery) ||
      contract.catalog.simpleDescription.toLowerCase().includes(normalizedQuery) ||
      contract.catalog.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      (contract.progress?.userNotes.toLowerCase().includes(normalizedQuery) ?? false);

    const matchesStatus =
      selectedStatus === 'todos' ||
      (selectedStatus === 'sin-seguimiento' && !contract.isTracked) ||
      contract.playerStatus === selectedStatus;
    const matchesRegion = selectedRegion === 'todos' || contract.catalog.region === selectedRegion;

    return matchesQuery && matchesStatus && matchesRegion;
  });
}
