import { createAlert, createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const coreSafetyRules: RecommendationRule[] = [
  ({ input, addItem, addAlert, addSummaryNote }) => {
    addItem(
      'essentials',
      createItem(
        'bandages-base',
        'Vendas',
        'curacion',
        input.level <= 5 ? 'alta' : 'media',
        'La curacion basica reduce el riesgo de perder la run por dano sostenido o sangrado.',
        input.level <= 5 ? 'x4' : 'x3',
      ),
    );

    addItem(
      'essentials',
      createItem(
        'food-base',
        'Comida segura',
        'comida',
        'media',
        'Salir con comida evita cortar la ruta por hambre o perdida de energia antes del objetivo.',
        'x2',
      ),
    );

    if (input.level <= 5) {
      addItem(
        'essentials',
        createItem(
          'low-level-safety-buffer',
          'Curacion de respaldo',
          'curacion',
          'alta',
          'Nivel bajo significa menos margen ante errores, criticos o encuentros encadenados.',
          'x1',
        ),
      );
      addAlert(
        createAlert(
          'low-level-risk',
          'Nivel bajo: evita entrar justo de recursos.',
          'seguridad',
          'alta',
          'El motor v1 aumenta la preparacion defensiva cuando el personaje todavia no tiene buen margen.',
        ),
      );
      addSummaryNote('Nivel bajo detectado: se prioriza seguridad antes que eficiencia.');
    }
  },
];
