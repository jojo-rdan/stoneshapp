import { createItem } from '@/features/dungeon-prep/recommendation-engine/helpers';
import type { RecommendationRule } from '@/features/dungeon-prep/recommendation-engine/types';

export const runTypeRules: RecommendationRule[] = [
  ({ input, addItem, addSummaryNote }) => {
    if (input.runType === 'contrato') {
      addItem(
        'recommended',
        createItem(
          'contract-objective-note',
          'Nota del objetivo',
          'utilidad',
          'media',
          'Los contratos son mas limpios cuando el objetivo queda claro antes de entrar.',
        ),
      );
    }

    if (input.runType === 'exploracion') {
      addItem(
        'recommended',
        createItem(
          'exploration-tools',
          'Herramientas de exploracion',
          'utilidad',
          'media',
          'Explorar rinde mejor si puedes abrir rutas o aprovechar hallazgos secundarios.',
          'x1',
        ),
      );
    }

    if (input.runType === 'farmeo') {
      addItem(
        'optional',
        createItem(
          'farming-efficiency-buffer',
          'Consumible de eficiencia',
          'combate',
          'baja',
          'Solo compensa si la ruta es segura y el objetivo es maximizar retorno por tiempo.',
          'x1',
        ),
      );
      addSummaryNote('Salida de farmeo: se evita sobregastar en consumibles no esenciales.');
    }

    if (input.runType === 'jefe') {
      addItem(
        'essentials',
        createItem(
          'boss-burst-safety',
          'Recurso defensivo fuerte',
          'seguridad',
          'critica',
          'Una salida de jefe necesita margen para picos de dano, no solo sustain promedio.',
          'x1',
        ),
      );
      addItem(
        'recommended',
        createItem(
          'boss-offensive-tool',
          'Herramienta ofensiva',
          'combate',
          'alta',
          'Ayuda a acortar la pelea si el costo de sostenerla empieza a subir.',
          'x1',
        ),
      );
      addSummaryNote('Salida de jefe: se prioriza supervivencia ante picos de dano.');
    }
  },
];
