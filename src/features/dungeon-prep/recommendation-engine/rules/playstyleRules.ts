import { createAlert, createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const playstyleRules: RecommendationRule[] = [
  ({ input, addItem, addAlert, addSummaryNote }) => {
    if (input.playstyle === 'seguro') {
      addItem(
        'essentials',
        createItem(
          'safe-playstyle-buffer',
          'Reserva defensiva',
          'seguridad',
          'alta',
          'El estilo seguro prioriza evitar retiradas costosas por falta de margen.',
          'x1',
        ),
      );
      addSummaryNote('Estilo seguro: se prioriza margen defensivo.');
    }

    if (input.playstyle === 'arriesgado') {
      addItem(
        'optional',
        createItem(
          'greedy-offensive-consumable',
          'Consumible ofensivo',
          'combate',
          'media',
          'Puede acelerar encuentros, pero no reemplaza curacion ni espacio libre.',
          'x1',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'greedy-free-space',
          'Espacio libre para botin',
          'inventario',
          'alta',
          'Un estilo codicioso necesita mas huecos libres para no convertir loot valioso en decisiones malas.',
          '4+ huecos',
        ),
      );
      addSummaryNote('Estilo arriesgado: se protege el valor del loot con espacio libre.');
    }

    if (input.playstyle === 'arriesgado' && input.freeSlots < 4) {
      addAlert(
        createAlert(
          'greedy-low-slots',
          'Pocos espacios para una salida codiciosa.',
          'inventario',
          'alta',
          'Antes de salir, vacia inventario o baja expectativas de loot.',
        ),
      );
    }
  },
];
