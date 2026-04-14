export const appRoutes = {
  dashboard: '/',
  prepareRun: '/preparar-salida',
  contracts: '/contratos',
  contractDetail: '/contratos/:contractId',
  history: '/historial',
  profile: '/perfil',
  overlaySettings: '/overlay',
  settings: '/configuracion',
} as const;

export function buildContractDetailPath(contractId: string) {
  return `/contratos/${contractId}`;
}
