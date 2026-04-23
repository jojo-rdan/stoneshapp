import { createAlert, createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const routeRules: RecommendationRule[] = [
  ({ input, addItem, addAlert, addSummaryNote }) => {
    if (input.distance === 'larga') {
      addItem(
        'essentials',
        createItem(
          'long-route-rations',
          'Raciones extra',
          'comida',
          'alta',
          'Una ruta larga castiga los errores de autonomia incluso antes de llegar a la dungeon.',
          'x2',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'long-route-water',
          'Agua o bebida segura',
          'comida',
          'media',
          'Mantiene estable la energia si la salida se alarga por exploracion o retirada.',
          'x1',
        ),
      );
      addSummaryNote('Distancia larga: se aumenta autonomia antes de priorizar loot.');
    }

    if (!input.caravanNearby) {
      addItem(
        'essentials',
        createItem(
          'no-caravan-retreat-plan',
          'Plan de retirada anotado',
          'escape',
          'alta',
          'Sin caravana cerca, retirarse tarde cuesta mas recursos y tiempo.',
        ),
      );
      addAlert(
        createAlert(
          'no-caravan-warning',
          'No hay caravana cerca.',
          'escape',
          'alta',
          'El motor recomienda cortar antes si la run empieza a consumir mas de lo previsto.',
        ),
      );
    }
  },
];
