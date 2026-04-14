import type { OverlaySettings } from '@/domains/overlay/overlay.types';

export const overlaySettingsMock: OverlaySettings = {
  id: 'overlay-default',
  mode: 'compacto',
  anchor: 'top-right',
  opacity: 82,
  use24HourClock: true,
  sessionReminderMinutes: 45,
  pinActiveContract: true,
  widgets: [
    {
      id: 'session-clock',
      label: 'Reloj de sesion',
      description: 'Muestra tiempo jugado y pausas acumuladas.',
      enabled: true,
    },
    {
      id: 'quick-note',
      label: 'Nota rapida',
      description: 'Deja una nota visible durante la run para recordar objetivos o errores.',
      enabled: false,
    },
    {
      id: 'contract-pin',
      label: 'Contrato anclado',
      description: 'Mantiene a la vista el objetivo actual del contrato.',
      enabled: true,
    },
  ],
};
