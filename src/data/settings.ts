import type { AppSetting } from '@/types/settings';

export const appSettings: AppSetting[] = [
  {
    id: 'language',
    label: 'Idioma',
    value: 'Español',
    description: 'La interfaz del MVP se mantiene completamente en español.',
  },
  {
    id: 'theme',
    label: 'Tema',
    value: 'Oscuro piedra',
    description: 'Base visual pensada para sesiones largas y ambiente fantasy.',
  },
  {
    id: 'storage',
    label: 'Persistencia',
    value: 'Mocks locales',
    description: 'Más adelante podrá migrar a almacenamiento local real.',
  },
];
