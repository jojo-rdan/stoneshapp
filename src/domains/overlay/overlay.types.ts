export type OverlayMode = 'compacto' | 'normal' | 'oculto';

export type OverlayAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type OverlaySize = 'pequeno' | 'medio' | 'grande';

export type OverlayWidgetId = 'session-clock' | 'contract-pin' | 'quick-note';

export type OverlayWidgetSetting = {
  id: OverlayWidgetId;
  label: string;
  description: string;
  enabled: boolean;
};

export type OverlaySettings = {
  id: string;
  enabled: boolean;
  mode: OverlayMode;
  anchor: OverlayAnchor;
  opacity: number;
  size: OverlaySize;
  showDayPhase: boolean;
  showEstimatedTime: boolean;
  use24HourClock: boolean;
  sessionReminderMinutes: number;
  pinActiveContract: boolean;
  widgets: OverlayWidgetSetting[];
};
