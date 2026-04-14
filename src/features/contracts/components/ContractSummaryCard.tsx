import { Link } from 'react-router-dom';
import { buildContractDetailPath } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { ContractEntry } from '@/domains/contracts/contract.types';
import { formatContractReward } from '@/services/contractsService';

type ContractSummaryCardProps = {
  contract: ContractEntry;
};

function getPriorityTone(priority: ContractEntry['priority']) {
  if (priority === 'alta') {
    return 'warning';
  }

  if (priority === 'media') {
    return 'neutral';
  }

  return 'success';
}

export function ContractSummaryCard({ contract }: ContractSummaryCardProps) {
  return (
    <Card
      title={contract.title}
      subtitle={`${contract.region} · ${contract.dungeonType}`}
      aside={formatContractReward(contract.rewardGold)}
    >
      <div className="contract-card__meta">
        <Badge tone={getPriorityTone(contract.priority)}>{contract.priority}</Badge>
        <Badge>{contract.status}</Badge>
        <Badge>Riesgo {contract.dangerScore}/5</Badge>
      </div>
      <p className="muted-copy">{contract.tacticalSummary}</p>
      <Link
        className="text-link"
        to={buildContractDetailPath(contract.id)}
      >
        Ver detalle del contrato
      </Link>
    </Card>
  );
}
