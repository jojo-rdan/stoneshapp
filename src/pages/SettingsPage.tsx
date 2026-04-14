import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getAppSettings } from '@/services/settingsService';

export function SettingsPage() {
  useDocumentTitle('Configuración');

  const settings = getAppSettings();

  return (
    <div className="page-stack">
      <Section
        title="Preferencias disponibles"
        description="Por ahora son mocks, pero ya están desacoplados en tipos, datos y servicios."
      >
        <div className="card-grid">
          {settings.map((setting) => (
            <Card
              key={setting.id}
              title={setting.label}
              subtitle={setting.description}
              aside={setting.value}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
