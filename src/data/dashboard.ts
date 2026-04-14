import type { DashboardStat, QuickNote } from '@/types/dashboard';

export const dashboardStats: DashboardStat[] = [
  {
    id: 'active-contracts',
    label: 'Contratos activos',
    value: '3',
    hint: '2 listos para planificar en detalle',
  },
  {
    id: 'average-risk',
    label: 'Riesgo promedio',
    value: 'Medio',
    hint: 'Base mock para un futuro score dinámico',
  },
  {
    id: 'inventory-readiness',
    label: 'Preparación actual',
    value: '74%',
    hint: 'Falta reponer vendajes y antídotos',
  },
];

export const dashboardNotes: QuickNote[] = [
  {
    id: 'note-1',
    title: 'Ruta sugerida',
    body: 'Priorizar Mannshire para una run corta con riesgo controlado.',
  },
  {
    id: 'note-2',
    title: 'Suministro crítico',
    body: 'Quedan pocos consumibles de curación para dungeons largas.',
  },
  {
    id: 'note-3',
    title: 'Idea futura',
    body: 'Comparar tiempo estimado vs. recompensa del contrato.',
  },
];

