import { matchPath } from 'react-router-dom';
import { appRoutes } from '@/app/routes';
import { navigationItems } from '@/data/navigation';

type ScreenMeta = {
  title: string;
  description: string;
};

const fallbackMeta: ScreenMeta = {
  title: 'Stoneshapp',
  description: 'Companion app de escritorio para planificar y seguir tus sesiones de Stoneshard.',
};

const dynamicScreens: Array<{ pattern: string; meta: ScreenMeta }> = [
  {
    pattern: appRoutes.contractDetail,
    meta: {
      title: 'Detalle de contrato',
      description: 'Vista detallada del contrato activo, con preparación y contexto para la run.',
    },
  },
  {
    pattern: '/404',
    meta: {
      title: 'Ruta no encontrada',
      description: 'La ruta solicitada no existe dentro del shell actual.',
    },
  },
];

export function getScreenMeta(pathname: string): ScreenMeta {
  const dynamicMatch = dynamicScreens.find((item) => matchPath(item.pattern, pathname));

  if (dynamicMatch) {
    return dynamicMatch.meta;
  }

  const navigationMatch = navigationItems.find((item) =>
    matchPath({ path: item.path, end: true }, pathname),
  );

  if (navigationMatch) {
    return {
      title: navigationMatch.label,
      description: navigationMatch.description,
    };
  }

  return fallbackMeta;
}
