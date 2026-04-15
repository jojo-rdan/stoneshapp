export type AppLanguage = 'es' | 'en';

export type AppTheme = 'oscuro-piedra' | 'oscuro-bruma';

export type LocalDataMode = 'solo-local' | 'backup-manual' | 'reinicio-rapido';

export type AppSettingsState = {
  language: AppLanguage;
  noviceMode: boolean;
  theme: AppTheme;
  localDataMode: LocalDataMode;
  autosaveNotes: boolean;
  keepMockDataBetweenSessions: boolean;
};

