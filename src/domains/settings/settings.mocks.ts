import type { AppSettingsState } from '@/domains/settings/settings.types';

export const appSettingsMock: AppSettingsState = {
  language: 'es',
  noviceMode: true,
  theme: 'oscuro-piedra',
  localDataMode: 'solo-local',
  autosaveNotes: true,
  keepMockDataBetweenSessions: true,
};
