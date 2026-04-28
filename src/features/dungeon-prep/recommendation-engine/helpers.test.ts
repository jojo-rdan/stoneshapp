import { describe, expect, it } from 'vitest';
import { createAlert, createItem, runRules } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';
import { createRecommendationInput } from '@/test/recommendationFixtures';

describe('recommendation-engine helpers', () => {
  it('deduplicates repeated items, alerts and summary notes by id/content', () => {
    const duplicateRule: RecommendationRule = ({ addItem, addAlert, addSummaryNote }) => {
      addItem(
        'essentials',
        createItem('duplicate-item', 'Venda', 'curacion', 'media', 'Texto repetido', 'x1'),
      );
      addItem(
        'essentials',
        createItem('duplicate-item', 'Venda', 'curacion', 'media', 'Texto repetido', 'x1'),
      );
      addAlert(createAlert('duplicate-alert', 'Cuidado', 'seguridad', 'alta', 'Alerta repetida'));
      addAlert(createAlert('duplicate-alert', 'Cuidado', 'seguridad', 'alta', 'Alerta repetida'));
      addSummaryNote('Nota unica.');
      addSummaryNote('Nota unica.');
    };

    const result = runRules(createRecommendationInput(), [duplicateRule]);

    expect(result.essentials).toHaveLength(1);
    expect(result.alerts).toHaveLength(1);
    expect(result.summary.match(/Nota unica\./g)).toHaveLength(1);
  });
});
