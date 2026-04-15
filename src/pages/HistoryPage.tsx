import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getRunHistory } from '@/services/historyService';

function getHistoryTone(result: 'exito' | 'retiro' | 'ajustar-build') {
  if (result === 'exito') {
    return 'success';
  }

  if (result === 'retiro') {
    return 'warning';
  }

  return 'neutral';
}

export function HistoryPage() {
  useDocumentTitle('Historial');

  const historyEntries = getRunHistory();
  const [selectedRunId, setSelectedRunId] = useState(historyEntries[0]?.id ?? '');
  const selectedRun = historyEntries.find((entry) => entry.id === selectedRunId) ?? historyEntries[0];

  if (!selectedRun) {
    return null;
  }

  return (
    <div className="page-stack">
      <Section
        title="Runs previas"
        description="Historial visual para recordar que funciono, que falto y que termino sobrando."
      >
        <div className="history-layout">
          <Card
            title="Lista de runs"
            subtitle="Selecciona una salida para ver su lectura rapida."
          >
            <div className="history-list">
              {historyEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={entry.id === selectedRun.id ? 'history-list__item history-list__item--active' : 'history-list__item'}
                  onClick={() => setSelectedRunId(entry.id)}
                >
                  <strong>{entry.runLabel}</strong>
                  <span>{entry.dateLabel}</span>
                  <small>{entry.durationMinutes} min</small>
                </button>
              ))}
            </div>
          </Card>

          <div className="page-stack">
            <Card
              title={selectedRun.runLabel}
              subtitle={`${selectedRun.dateLabel} · ${selectedRun.durationMinutes} min`}
              aside={selectedRun.lootSummary}
            >
              <Badge tone={getHistoryTone(selectedRun.outcome)}>{selectedRun.outcome}</Badge>
              <p className="history-summary">{selectedRun.notes}</p>
            </Card>

            <div className="card-grid card-grid--wide">
              <Card title="Faltantes">
                <ul className="detail-list">
                  {selectedRun.missingItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Sobrantes">
                <ul className="detail-list">
                  {selectedRun.leftoverItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="card-grid card-grid--wide">
              <Card title="Observaciones">
                <ul className="detail-list">
                  {selectedRun.observations.map((observation) => (
                    <li key={observation}>{observation}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Resultado y aprendizaje">
                <ul className="detail-list">
                  {selectedRun.lessonsLearned.map((lesson) => (
                    <li key={lesson}>{lesson}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
