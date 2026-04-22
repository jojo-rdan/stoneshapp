import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { FormField } from '@/components/forms/FormField';
import { SwitchField } from '@/components/forms/SwitchField';
import type { OverlayAnchor, OverlayMode, OverlaySettings, OverlaySize } from '@/domains/overlay/overlay.types';
import { OverlayPreviewCard } from '@/features/overlay/components/OverlayPreviewCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getOverlaySettings, updateOverlaySettings } from '@/services/overlayService';

export function OverlaySettingsPage() {
  useDocumentTitle('Overlay');

  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>(getOverlaySettings());

  function updateOverlay<K extends keyof OverlaySettings>(field: K, value: OverlaySettings[K]) {
    setOverlaySettings(updateOverlaySettings({ [field]: value }));
  }

  return (
    <div className="page-stack">
      <Section
        title="Controles del overlay"
        description="Configuracion mock del gadget de tiempo para el MVP visual."
      >
        <div className="overlay-layout">
          <Card
            title="Ajustes"
            subtitle="Controles listos para conectar persistencia despues."
          >
            <div className="form-grid form-grid--wide">
              <SwitchField
                label="Activar overlay"
                checked={overlaySettings.enabled}
                onChange={(checked) => updateOverlay('enabled', checked)}
              />
              <SwitchField
                label="Mostrar fase del dia"
                checked={overlaySettings.showDayPhase}
                onChange={(checked) => updateOverlay('showDayPhase', checked)}
              />
              <SwitchField
                label="Mostrar hora estimada"
                checked={overlaySettings.showEstimatedTime}
                onChange={(checked) => updateOverlay('showEstimatedTime', checked)}
              />
            </div>

            <div className="form-grid">
              <FormField label="Posicion">
                <select
                  value={overlaySettings.anchor}
                  onChange={(event) => updateOverlay('anchor', event.target.value as OverlayAnchor)}
                >
                  <option value="top-left">top-left</option>
                  <option value="top-right">top-right</option>
                  <option value="bottom-left">bottom-left</option>
                  <option value="bottom-right">bottom-right</option>
                </select>
              </FormField>

              <FormField label="Modo">
                <select
                  value={overlaySettings.mode}
                  onChange={(event) => updateOverlay('mode', event.target.value as OverlayMode)}
                >
                  <option value="compacto">compacto</option>
                  <option value="normal">normal</option>
                  <option value="oculto">oculto</option>
                </select>
              </FormField>

              <FormField label="Tamaño">
                <select
                  value={overlaySettings.size}
                  onChange={(event) => updateOverlay('size', event.target.value as OverlaySize)}
                >
                  <option value="pequeno">pequeno</option>
                  <option value="medio">medio</option>
                  <option value="grande">grande</option>
                </select>
              </FormField>

              <FormField label={`Transparencia ${overlaySettings.opacity}%`}>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={overlaySettings.opacity}
                  onChange={(event) => updateOverlay('opacity', Number(event.target.value))}
                />
              </FormField>
            </div>
          </Card>

          <Card
            title="Vista previa simple"
            subtitle="Una representacion visual ligera del gadget."
          >
            <div className="overlay-preview">
              <div
                className={`overlay-preview__panel overlay-preview__panel--${overlaySettings.size}`}
                style={{ opacity: overlaySettings.opacity / 100 }}
              >
                <span>{overlaySettings.enabled ? 'Overlay activo' : 'Overlay desactivado'}</span>
                {overlaySettings.showEstimatedTime && <strong>14:35</strong>}
                {overlaySettings.showDayPhase && <small>Tarde clara</small>}
              </div>
            </div>
            <ul className="detail-list">
              <li>Posicion: {overlaySettings.anchor}</li>
              <li>Modo: {overlaySettings.mode}</li>
              <li>Widgets activos: {overlaySettings.widgets.filter((widget) => widget.enabled).length}</li>
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
