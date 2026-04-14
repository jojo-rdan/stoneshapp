import type { RunHistory } from '@/domains/history/history.types';

export const runHistoryEntries: RunHistory[] = [
  {
    id: 'run-001',
    profileId: 'profile-alden-guardia',
    contractId: 'contract-osbrook-bandidos',
    runLabel: 'Bandidos en la ruta norte',
    outcome: 'exito',
    dateLabel: 'Hace 2 dias',
    durationMinutes: 34,
    lootSummary: 'Buen retorno en armas ligeras y piezas vendibles.',
    lessonsLearned: ['El espacio libre en inventario definio la ganancia final.'],
    consumedSupplies: ['Vendas x1', 'Agua x1'],
    notes: 'Run comoda, sin picos de riesgo. Buen candidato para repetir con foco economico.',
  },
  {
    id: 'run-002',
    profileId: 'profile-alden-guardia',
    contractId: 'contract-brynn-cripta',
    runLabel: 'Cripta inundada',
    outcome: 'ajustar-build',
    dateLabel: 'Hace 4 dias',
    durationMinutes: 49,
    lootSummary: 'Botin aceptable, pero con demasiado gasto de curacion.',
    lessonsLearned: ['Falto resistencia al dolor y sobro peso en utilidades ofensivas.'],
    consumedSupplies: ['Vendajes x4', 'Pomada curativa x2', 'Hierbas x1'],
    notes: 'El problema no fue la ruta sino la falta de margen cuando la run se alargo.',
  },
  {
    id: 'run-003',
    profileId: 'profile-alden-guardia',
    contractId: 'contract-mannshire-catacumbas',
    runLabel: 'Recuperacion de reliquia',
    outcome: 'retiro',
    dateLabel: 'Hace 1 semana',
    durationMinutes: 27,
    lootSummary: 'Salida interrumpida con progreso parcial.',
    lessonsLearned: ['La retirada temprana salvo equipo, pero falto planear mejor el espacio de carga.'],
    consumedSupplies: ['Vendas x2', 'Comida seca x1'],
    notes: 'Buen recordatorio de que la logistica importa tanto como el combate.',
  },
];

