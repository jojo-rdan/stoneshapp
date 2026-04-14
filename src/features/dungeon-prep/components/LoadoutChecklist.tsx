import { Card } from '@/components/ui/Card';

type LoadoutChecklistProps = {
  title: string;
  items: string[];
};

export function LoadoutChecklist({ title, items }: LoadoutChecklistProps) {
  return (
    <Card
      title={title}
      subtitle="Base mock para checklist modular"
    >
      <ul className="checklist">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}

