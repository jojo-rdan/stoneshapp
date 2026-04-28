import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { PreparationChecklistItem } from '@/domains/preparation/preparation.types';

type ChecklistBucketCardProps = {
  title: string;
  subtitle: string;
  items: PreparationChecklistItem[];
};

export function ChecklistBucketCard({ title, subtitle, items }: ChecklistBucketCardProps) {
  function getSeverityTone(severity?: string): 'neutral' | 'warning' | 'success' {
    if (severity === 'critica' || severity === 'alta') {
      return 'warning';
    }

    if (severity === 'baja') {
      return 'success';
    }

    return 'neutral';
  }

  return (
    <Card
      title={title}
      subtitle={subtitle}
    >
      <ul className="result-list">
        {items.map((item) => (
          <li
            key={item.id}
            className="result-list__item"
          >
            <strong>
              {item.label}
              {item.quantity ? ` ${item.quantity}` : ''}
            </strong>
            {(item.category || item.severity) && (
              <div className="result-list__badges">
                {item.severity && <Badge tone={getSeverityTone(item.severity)}>{item.severity}</Badge>}
                {item.category && <Badge>{item.category}</Badge>}
              </div>
            )}
            <p>{item.reason}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
