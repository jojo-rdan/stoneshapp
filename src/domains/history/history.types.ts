export type RunHistoryType = 'contrato' | 'exploracion' | 'farmeo' | 'jefe';

export type RunHistoryResult = 'exito' | 'retiro' | 'fallida' | 'ajustar-preparacion';

export type RunFeedbackTag =
  | 'falto-comida'
  | 'falto-curacion'
  | 'falto-herramienta'
  | 'sobro-inventario'
  | 'run-arriesgada'
  | 'run-comoda';

export type RunHistory = {
  id: string;
  profileId: string;
  date: string;
  runType: RunHistoryType;
  result: RunHistoryResult;
  label: string;
  contractCatalogId?: string;
  missingItems: string[];
  leftoverItems: string[];
  observations: string;
  feedbackTags: RunFeedbackTag[];
  notes: string;
};
