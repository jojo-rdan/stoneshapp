import type { DesktopBridge } from '@/integrations/desktop/desktop.types';

const webDesktopBridge: DesktopBridge = {
  environment: 'web',
  isDesktop: false,
  canUseOverlayWindow: () => false,
  openOverlayPreview: async () => {
    // Placeholder web bridge. Future Tauri integration should replace this adapter.
  },
  closeOverlayPreview: async () => {
    // Placeholder web bridge. Future Tauri integration should replace this adapter.
  },
};

export const desktopBridge = webDesktopBridge;
