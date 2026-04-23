import { createAlert, createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const dungeonRules: RecommendationRule[] = [
  ({ input, addItem, addAlert, addSummaryNote }) => {
    if (!input.dungeonKnown) {
      addItem(
        'essentials',
        createItem(
          'unknown-dungeon-scouting-buffer',
          'Margen de exploracion',
          'seguridad',
          'alta',
          'Una dungeon desconocida exige preparacion conservadora porque el tipo de presion aun no esta confirmado.',
          'x1',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'unknown-dungeon-utility-kit',
          'Utilidad flexible',
          'utilidad',
          'media',
          'Herramientas versatiles cubren mejor rutas, cerraduras o encuentros no previstos.',
          'x1',
        ),
      );
      addAlert(
        createAlert(
          'unknown-dungeon-alert',
          'Dungeon desconocida: evita entrar con inventario justo.',
          'seguridad',
          'alta',
          'La recomendacion se vuelve mas conservadora cuando falta informacion del destino.',
        ),
      );
      addSummaryNote('Dungeon desconocida: se activa checklist conservadora.');
    }

    if (input.dungeonType === 'catacumbas' || input.dungeonType === 'cripta') {
      addItem(
        'recommended',
        createItem(
          'undead-dungeon-remedy',
          'Antidoto o hierbas',
          'utilidad',
          'media',
          'Catacumbas y criptas suelen castigar con efectos molestos y desgaste acumulado.',
          'x1',
        ),
      );
    }

    if (input.dungeonType === 'cueva') {
      addItem(
        'recommended',
        createItem(
          'cave-sustain',
          'Consumible de seguridad',
          'curacion',
          'media',
          'Las cuevas pueden forzar encuentros irregulares donde conviene tener margen defensivo.',
          'x1',
        ),
      );
    }

    if (input.level < 6 && input.dungeonType === 'cripta') {
      addAlert(
        createAlert(
          'low-level-crypt-risk',
          'Cripta exigente para nivel bajo.',
          'seguridad',
          'critica',
          'Si la run no es obligatoria, conviene posponerla o entrar con un plan de retirada muy claro.',
        ),
      );
    }
  },
];
