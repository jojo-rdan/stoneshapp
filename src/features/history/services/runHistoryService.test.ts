import { beforeEach, describe, expect, it } from 'vitest';
import {
  createRunHistoryEntry,
  formatRunHistoryDate,
  getRunHistory,
  getRunHistoryInsights,
  getRunHistoryResultLabel,
  resetRunHistory,
} from '@/services/historyService';
import { localStorageAdapter, STORAGE_KEYS } from '@/shared/storage';
import { clearStoneshappStorage } from '@/test/testStorage';

describe('runHistoryService', () => {
  beforeEach(() => {
    clearStoneshappStorage();
  });

  it('persists run feedback and summarizes recurring patterns', () => {
    resetRunHistory();

    const created = createRunHistoryEntry({
      profileId: 'profile-alden-guardia',
      date: '2026-04-27T16:00:00.000Z',
      runType: 'contrato',
      result: 'ajustar-preparacion',
      label: 'Catacumbas con margen corto',
      missingItems: ['Comida seca', 'Venda extra'],
      leftoverItems: ['Espacio libre'],
      observations: 'Se sintió justa desde mitad de run.',
      feedbackTags: ['falto-comida', 'run-arriesgada'],
      notes: 'Conviene sumar sustain para la próxima.',
    });

    const history = getRunHistory();
    expect(history[0]?.id).toBe(created.id);
    expect(formatRunHistoryDate(created.date)).toContain('2026');
    expect(getRunHistoryResultLabel(created.result)).toBe('Ajustar preparación');

    const insights = getRunHistoryInsights(history);
    expect(insights.feedback.find((item) => item.tag === 'falto-comida')?.count).toBeGreaterThanOrEqual(1);
    expect(insights.recurringMissingItems[0]).toMatchObject({
      label: 'Comida seca',
    });
  });

  it('migrates legacy stored history entries to the Sprint 2 format', () => {
    localStorageAdapter.setItem(
      STORAGE_KEYS.runHistory,
      JSON.stringify({
        schemaVersion: 1,
        seededAt: '2026-04-20T00:00:00.000Z',
        updatedAt: '2026-04-20T00:00:00.000Z',
        data: [
          {
            id: 'legacy-run',
            profileId: 'profile-alden-guardia',
            contractId: 'contract-legacy',
            runLabel: 'Run legacy',
            outcome: 'ajustar-build',
            dateLabel: 'Hace 2 dias',
            durationMinutes: 44,
            lootSummary: 'Botín irregular.',
            lessonsLearned: ['Faltó comida y curación.'],
            consumedSupplies: ['Vendas x2'],
            missingItems: ['Comida seca'],
            leftoverItems: ['Ganzúas x1'],
            observations: ['Se sintió apretada.'],
            notes: 'Conviene revisar inventario.',
          },
        ],
      }),
    );

    const migrated = getRunHistory()[0];

    expect(migrated).toMatchObject({
      id: 'legacy-run',
      label: 'Run legacy',
      result: 'ajustar-preparacion',
      runType: 'contrato',
      missingItems: ['Comida seca'],
    });
    expect(migrated.feedbackTags).toEqual(expect.arrayContaining(['falto-comida', 'run-arriesgada']));
  });
});
