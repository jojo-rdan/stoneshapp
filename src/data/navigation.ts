import { appRoutes } from '@/app/routes';
import type { NavigationItem } from '@/types/navigation';

export const navigationItems: NavigationItem[] = [
  {
    label: 'Inicio',
    description: 'Resumen general del estado actual de la app y de la próxima salida sugerida.',
    path: appRoutes.dashboard,
  },
  {
    label: 'Preparar salida',
    description: 'Checklist, suministros y preparación ligera antes de entrar a una dungeon.',
    path: appRoutes.prepareRun,
  },
  {
    label: 'Contratos',
    description: 'Seguimiento claro de contratos activos y acceso rápido a su detalle.',
    path: appRoutes.contracts,
  },
  {
    label: 'Historial',
    description: 'Resultados recientes, aprendizajes y notas rápidas de runs anteriores.',
    path: appRoutes.history,
  },
  {
    label: 'Perfil',
    description: 'Build, objetivos y foco actual del personaje.',
    path: appRoutes.profile,
  },
  {
    label: 'Overlay',
    description: 'Espacio reservado para el módulo experimental de overlay y reloj.',
    path: appRoutes.overlaySettings,
  },
  {
    label: 'Configuración',
    description: 'Preferencias globales, tema y base de comportamiento del shell.',
    path: appRoutes.settings,
  },
];
