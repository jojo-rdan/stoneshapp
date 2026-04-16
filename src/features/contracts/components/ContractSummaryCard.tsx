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
      subtitle={`${contract.region} · ${contract.locationLabel}`}
      aside={formatContractReward(contract.rewardGold)}
    >
      <div className="contract-card__meta">
        <Badge tone={getPriorityTone(contract.priority)}>{contract.priority}</Badge>
        <Badge>{contract.status}</Badge>
        <Badge>Riesgo {contract.dangerScore}/5</Badge>
      </div>

      <p>{contract.shortDescription}</p>
      <p className="muted-copy">{contract.tacticalSummary}</p>

      <div className="contract-card__footer">
        <small>Lo entrega: {contract.issuer}</small>
        <Link
          className="text-link"
          to={buildContractDetailPath(contract.id)}
        >
          Abrir guia del contrato
        </Link>
      </div>
    </Card>
  );
}
