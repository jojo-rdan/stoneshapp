import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { OverlayWidgetSetting } from '@/domains/overlay/overlay.types';

type OverlayPreviewCardProps = {
  setting: OverlayWidgetSetting;
};

export function OverlayPreviewCard({ setting }: OverlayPreviewCardProps) {
  return (
    <Card
      title={setting.label}
      subtitle={setting.description}
    >
      <Badge tone={setting.enabled ? 'success' : 'neutral'}>
        {setting.enabled ? 'Activo en mock' : 'Pendiente'}
      </Badge>
    </Card>
  );
}
