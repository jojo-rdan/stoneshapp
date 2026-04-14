import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { OverlayPreviewCard } from '@/features/overlay/components/OverlayPreviewCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getOverlaySettings } from '@/services/overlayService';

export function OverlaySettingsPage() {
  useDocumentTitle('Overlay');

  const overlaySettings = getOverlaySettings();

  return (
    <div className="page-stack">
      <Section
        title="Estado actual"
        description="OverlaySettings ya modela modo, posicion, opacidad y widgets del gadget."
      >
        <div className="card-grid card-grid--wide">
          <Card title="Modo actual">
            <ul className="detail-list">
              <li>Modo: {overlaySettings.mode}</li>
              <li>Posicion: {overlaySettings.anchor}</li>
              <li>Opacidad: {overlaySettings.opacity}%</li>
            </ul>
          </Card>
          <Card title="Comportamiento">
            <ul className="detail-list">
              <li>Reloj 24h: {overlaySettings.use24HourClock ? 'Si' : 'No'}</li>
              <li>Recordatorio: cada {overlaySettings.sessionReminderMinutes} min</li>
              <li>Contrato anclado: {overlaySettings.pinActiveContract ? 'Activo' : 'Inactivo'}</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section
        title="Widgets mock"
        description="Configuraciones listas para renderizar la UI del futuro gadget de tiempo."
      >
        <div className="card-grid">
          {overlaySettings.widgets.map((setting) => (
            <OverlayPreviewCard
              key={setting.id}
              setting={setting}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
