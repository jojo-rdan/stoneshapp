export type DesktopEnvironment = 'web' | 'tauri';

export type OverlayWindowPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export interface OverlayPreviewPayload {
  dayPhase: string;
  estimatedHour: string;
  position: OverlayWindowPosition;
  opacity: number;
  scale: number;
}

export interface DesktopBridge {
  readonly environment: DesktopEnvironment;
  readonly isDesktop: boolean;
  canUseOverlayWindow(): boolean;
  openOverlayPreview(payload: OverlayPreviewPayload): Promise<void>;
  closeOverlayPreview(): Promise<void>;
}
