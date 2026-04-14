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

  return (
    <div className="page-stack">
      <Section
        title="Runs recientes"
        description="Historial inicial del jugador con outcome, botin y aprendizajes por salida."
      >
        <div className="card-grid">
          {historyEntries.map((entry) => (
            <Card
              key={entry.id}
              title={entry.runLabel}
              subtitle={`${entry.dateLabel} · ${entry.durationMinutes} min`}
            >
              <Badge tone={getHistoryTone(entry.outcome)}>{entry.outcome}</Badge>
              <p className="history-summary">{entry.notes}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
