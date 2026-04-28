import type { RunFeedbackTag, RunHistoryResult, RunHistoryType } from '@/domains/history/history.types';

export const runHistoryTypeOptions: Array<{ value: RunHistoryType; label: string }> = [
  { value: 'contrato', label: 'Contrato' },
  { value: 'exploracion', label: 'Exploración' },
  { value: 'farmeo', label: 'Farmeo' },
  { value: 'jefe', label: 'Jefe' },
];

export const runHistoryResultOptions: Array<{ value: RunHistoryResult; label: string }> = [
  { value: 'exito', label: 'Éxito' },
  { value: 'retiro', label: 'Retiro' },
  { value: 'fallida', label: 'Fallida' },
  { value: 'ajustar-preparacion', label: 'Ajustar preparación' },
];

export const runFeedbackOptions: Array<{
  value: RunFeedbackTag;
  label: string;
  description: string;
}> = [
  {
    value: 'falto-comida',
    label: 'Faltó comida',
    description: 'La salida se alargó o el sustain se quedó corto.',
  },
  {
    value: 'falto-curacion',
    label: 'Faltó curación',
    description: 'La run pidió más margen de recuperación.',
  },
  {
    value: 'falto-herramienta',
    label: 'Faltó herramienta',
    description: 'Hizo falta utilidad, reparación o una pieza concreta.',
  },
  {
    value: 'sobro-inventario',
    label: 'Sobró inventario',
    description: 'Quedó demasiado margen sin usar en la mochila.',
  },
  {
    value: 'run-arriesgada',
    label: 'Run muy arriesgada',
    description: 'Se sintió apretada, tensa o con poca seguridad.',
  },
  {
    value: 'run-comoda',
    label: 'Run cómoda',
    description: 'La preparación fue estable y con buen margen.',
  },
];

export const runFeedbackLabels = Object.fromEntries(
  runFeedbackOptions.map((option) => [option.value, option.label]),
) as Record<RunFeedbackTag, string>;

export const runHistoryResultLabels = Object.fromEntries(
  runHistoryResultOptions.map((option) => [option.value, option.label]),
) as Record<RunHistoryResult, string>;

export const runHistoryTypeLabels = Object.fromEntries(
  runHistoryTypeOptions.map((option) => [option.value, option.label]),
) as Record<RunHistoryType, string>;
