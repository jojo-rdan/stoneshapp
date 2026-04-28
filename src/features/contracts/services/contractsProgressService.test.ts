import { beforeEach, describe, expect, it } from 'vitest';
import {
  createPlayerContractFromCatalog,
  getActivePlayerContracts,
  getContractStatusSummary,
  getContractViewById,
  getTrackedContractViews,
  resetContractsProgress,
  updatePlayerContractNotes,
  updatePlayerContractStatus,
} from '@/services/contractsService';
import { clearStoneshappStorage } from '@/test/testStorage';

describe('contractsProgressService', () => {
  beforeEach(() => {
    clearStoneshappStorage();
    resetContractsProgress();
  });

  it('creates tracked contracts and persists notes/status updates', () => {
    const created = createPlayerContractFromCatalog('catalog-osbrook-north-bandits');

    expect(created?.playerStatus).toBe('activo');
    expect(getTrackedContractViews()).toHaveLength(1);

    updatePlayerContractNotes('catalog-osbrook-north-bandits', 'Priorizar loot ligero.');
    updatePlayerContractStatus('catalog-osbrook-north-bandits', 'pausado');

    expect(getContractViewById('catalog-osbrook-north-bandits')).toMatchObject({
      playerStatus: 'pausado',
      progress: {
        userNotes: 'Priorizar loot ligero.',
      },
    });
  });

  it('applies the requested status even if tracking did not exist before', () => {
    updatePlayerContractStatus('catalog-mannshire-east-catacombs', 'completado');

    expect(getContractViewById('catalog-mannshire-east-catacombs')?.playerStatus).toBe('completado');
    expect(getContractStatusSummary().find((item) => item.status === 'completado')?.count).toBe(1);
    expect(getActivePlayerContracts()).toHaveLength(0);
  });
});
