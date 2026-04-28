import { beforeEach, describe, expect, it } from 'vitest';
import { createPlayerContractFromCatalog, getContractCatalogViews, updatePlayerContractNotes, updatePlayerContractStatus } from '@/services/contractsService';
import { clearStoneshappStorage } from '@/test/testStorage';
import { filterContractCatalogViews } from '@/features/contracts/services/contractCatalogFilters';

describe('filterContractCatalogViews', () => {
  beforeEach(() => {
    clearStoneshappStorage();
  });

  it('filters active tracked contracts by region and search query', () => {
    createPlayerContractFromCatalog('catalog-osbrook-north-bandits');
    createPlayerContractFromCatalog('catalog-mannshire-east-catacombs');
    updatePlayerContractStatus('catalog-mannshire-east-catacombs', 'pausado');
    updatePlayerContractNotes('catalog-mannshire-east-catacombs', 'Buen contrato para practicar retirada.');

    const filtered = filterContractCatalogViews({
      contracts: getContractCatalogViews(),
      viewMode: 'activos',
      searchQuery: 'retirada',
      selectedStatus: 'pausado',
      selectedRegion: 'Mannshire',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.catalog.id).toBe('catalog-mannshire-east-catacombs');
  });

  it('can isolate untracked catalog entries', () => {
    createPlayerContractFromCatalog('catalog-osbrook-north-bandits');

    const filtered = filterContractCatalogViews({
      contracts: getContractCatalogViews(),
      viewMode: 'catalogo',
      searchQuery: '',
      selectedStatus: 'sin-seguimiento',
      selectedRegion: 'todos',
    });

    expect(filtered.some((entry) => entry.catalog.id === 'catalog-osbrook-north-bandits')).toBe(false);
    expect(filtered.every((entry) => entry.isTracked === false)).toBe(true);
  });
});
