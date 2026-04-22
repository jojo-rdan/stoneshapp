import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { FormField } from '@/components/forms/FormField';
import { SwitchField } from '@/components/forms/SwitchField';
import type { AppLanguage, AppSettingsState, AppTheme, LocalDataMode } from '@/domains/settings/settings.types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getAppSettings, updateAppSettings } from '@/services/settingsService';

export function SettingsPage() {
  useDocumentTitle('Configuración');

  const [settings, setSettings] = useState<AppSettingsState>(getAppSettings());

  function updateSettings<K extends keyof AppSettingsState>(field: K, value: AppSettingsState[K]) {
    setSettings(updateAppSettings({ [field]: value }));
  }

  return (
    <div className="page-stack">
      <Section
        title="Configuracion general"
        description="Opciones base del MVP para idioma, experiencia y manejo local de datos."
      >
        <div className="card-grid card-grid--wide">
          <Card
            title="Preferencias de la app"
            subtitle="Todo en estado local y mock por ahora."
          >
            <div className="form-grid">
              <FormField label="Idioma">
                <select
                  value={settings.language}
                  onChange={(event) => updateSettings('language', event.target.value as AppLanguage)}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </FormField>

              <FormField label="Tema">
                <select
                  value={settings.theme}
                  onChange={(event) => updateSettings('theme', event.target.value as AppTheme)}
                >
                  <option value="oscuro-piedra">oscuro-piedra</option>
                  <option value="oscuro-bruma">oscuro-bruma</option>
                </select>
              </FormField>

              <FormField label="Datos locales">
                <select
                  value={settings.localDataMode}
                  onChange={(event) => updateSettings('localDataMode', event.target.value as LocalDataMode)}
                >
                  <option value="solo-local">solo-local</option>
                  <option value="backup-manual">backup-manual</option>
                  <option value="reinicio-rapido">reinicio-rapido</option>
                </select>
              </FormField>
            </div>

            <div className="form-grid form-grid--toggles">
              <SwitchField
                label="Modo novato"
                description="Mantiene textos mas guiados y menos carga de decisiones."
                checked={settings.noviceMode}
                onChange={(checked) => updateSettings('noviceMode', checked)}
              />
              <SwitchField
                label="Autoguardado de notas"
                description="Simula una preferencia lista para persistencia futura."
                checked={settings.autosaveNotes}
                onChange={(checked) => updateSettings('autosaveNotes', checked)}
              />
              <SwitchField
                label="Mantener mocks entre sesiones"
                description="Base util para probar comportamiento local del MVP."
                checked={settings.keepMockDataBetweenSessions}
                onChange={(checked) => updateSettings('keepMockDataBetweenSessions', checked)}
              />
            </div>
          </Card>

          <Card
            title="Resumen actual"
            subtitle="Lectura rapida de la configuracion activa."
          >
            <ul className="detail-list">
              <li>Idioma: {settings.language === 'es' ? 'Español' : 'English'}</li>
              <li>Modo novato: {settings.noviceMode ? 'Activado' : 'Desactivado'}</li>
              <li>Tema: {settings.theme}</li>
              <li>Datos locales: {settings.localDataMode}</li>
              <li>Autoguardado: {settings.autosaveNotes ? 'Si' : 'No'}</li>
            </ul>
          </Card>
        </div>
      </Section>
    </div>
  );
}
