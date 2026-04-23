import { createAlert, createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const inventoryRules: RecommendationRule[] = [
  ({ input, addItem, addAlert }) => {
    if (input.freeSlots < 3) {
      addAlert(
        createAlert(
          'low-free-slots',
          'Inventario demasiado justo.',
          'inventario',
          'alta',
          'Con menos de tres espacios libres, cualquier botin o consumible nuevo fuerza descartes tempranos.',
        ),
      );
      addItem(
        'essentials',
        createItem(
          'free-slots-before-leaving',
          'Liberar inventario',
          'inventario',
          'alta',
          'La preparacion no esta completa si no queda margen para botin critico o consumibles de emergencia.',
          '3+ huecos',
        ),
      );
    }

    if (input.freeSlots >= 6) {
      addItem(
        'optional',
        createItem(
          'extra-loot-route-note',
          'Nota de prioridad de loot',
          'inventario',
          'baja',
          'Con espacio suficiente, conviene decidir antes que objetos tienen prioridad al volver.',
        ),
      );
    }
  },
];
