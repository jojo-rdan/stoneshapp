import type { PreparationPreset } from '@/domains/preparation/preparation.types';

export const preparationPresets: PreparationPreset[] = [
  {
    id: 'preset-seguro-mannshire',
    profileId: 'profile-alden-guardia',
    name: 'Salida segura de catacumbas',
    intent: 'segura',
    description: 'Preset conservador para contratos de riesgo medio con foco en aguante y margen de error.',
    budgetEstimate: 420,
    recommendedFor: ['Catacumbas', 'Criptas medianas', 'Runs con no-muertos'],
    supplies: [
      {
        id: 'vendas',
        name: 'Vendas',
        quantity: 'x4',
        category: 'curacion',
        reason: 'Cubre sangrado y desgaste prolongado.',
      },
      {
        id: 'pomada',
        name: 'Pomada curativa',
        quantity: 'x2',
        category: 'curacion',
        reason: 'Mejora la recuperacion sostenida entre combates.',
      },
      {
        id: 'antidoto',
        name: 'Antidoto',
        quantity: 'x1',
        category: 'utilidad',
        reason: 'Protege frente a encuentros con veneno o podredumbre.',
      },
      {
        id: 'raciones',
        name: 'Comida seca',
        quantity: 'x2',
        category: 'comida',
        reason: 'Mantiene energia estable sin castigar el inventario.',
      },
    ],
    checklist: [
      'Revisar durabilidad del escudo y espada',
      'Salir con un hueco libre para botin critico',
      'Definir ruta de vuelta antes de entrar',
    ],
    fallbackPlan: 'Si el dano recibido escala demasiado rapido, cortar la run y conservar consumibles clave.',
  },
  {
    id: 'preset-equilibrado-brynn',
    profileId: 'profile-lyra-exploradora',
    name: 'Exploracion equilibrada de Brynn',
    intent: 'equilibrada',
    description: 'Preset flexible para runs donde importa moverse rapido sin perder sostenibilidad.',
    budgetEstimate: 360,
    recommendedFor: ['Ruinas abiertas', 'Campamentos', 'Contratos de movilidad'],
    supplies: [
      {
        id: 'vendas-ligeras',
        name: 'Vendas',
        quantity: 'x3',
        category: 'curacion',
        reason: 'Cobertura minima sin sobrecargar el inventario.',
      },
      {
        id: 'agua',
        name: 'Agua',
        quantity: 'x1',
        category: 'comida',
        reason: 'Mantiene estabilidad para trayectos medios.',
      },
      {
        id: 'ganzuas',
        name: 'Ganzuas',
        quantity: 'x2',
        category: 'utilidad',
        reason: 'Aumenta el valor esperado del recorrido.',
      },
    ],
    checklist: [
      'Comprobar municion y espacio para loot',
      'Anotar un punto de salida rapido',
      'Evitar sobreinvertir en curacion antes de confirmar el tipo de enemigos',
    ],
    fallbackPlan: 'Mantener distancia y recortar la exploracion si la ruta se vuelve ineficiente.',
  },
];

