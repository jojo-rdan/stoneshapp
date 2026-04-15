import { Card } from '@/components/ui/Card';
import type { PreparationChecklistItem } from '@/domains/preparation/preparation.types';

type ChecklistBucketCardProps = {
  title: string;
  subtitle: string;
  items: PreparationChecklistItem[];
};

export function ChecklistBucketCard({ title, subtitle, items }: ChecklistBucketCardProps) {
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
            <strong>{item.label}</strong>
            <p>{item.reason}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
