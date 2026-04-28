import { Link } from 'react-router-dom';
import { buildContractDetailPath } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ContractCatalogView, ContractNovicePriority } from '@/domains/contracts/contract.types';
import { formatContractReward } from '@/services/contractsService';

type ContractSummaryCardProps = {
  contract: ContractCatalogView;
  onTrack?: (catalogId: string) => void;
};

function getNovicePriorityTone(priority?: ContractNovicePriority) {
  if (priority === 'alta' || priority === 'evitar') {
    return 'warning';
  }

  if (priority === 'baja') {
    return 'success';
  }

  return 'neutral';
}

function getStatusTone(status: ContractCatalogView['playerStatus']) {
  if (status === 'activo' || status === 'pausado') {
    return 'warning';
  }

  if (status === 'completado') {
    return 'success';
  }

  return 'neutral';
}

export function ContractSummaryCard({ contract, onTrack }: ContractSummaryCardProps) {
  const { catalog } = contract;

  return (
    <Card
      title={catalog.name}
      subtitle={`${catalog.region} · ${catalog.objectiveType} · Lo entrega ${catalog.issuerNpc}`}
      aside={formatContractReward(catalog.estimatedRewardGold)}
    >
      <div className="contract-card__meta">
        <Badge tone={getStatusTone(contract.playerStatus)}>{contract.playerStatus}</Badge>
        {catalog.novicePriority && (
          <Badge tone={getNovicePriorityTone(catalog.novicePriority)}>
            novato: {catalog.novicePriority}
          </Badge>
        )}
      </div>

      <p>{catalog.simpleDescription}</p>
      <p className="muted-copy">{catalog.tags.join(' · ')}</p>

      <div className="contract-card__footer">
        {!contract.isTracked && onTrack ? (
          <Button
            variant="secondary"
            onClick={() => onTrack(catalog.id)}
          >
            Iniciar seguimiento
          </Button>
        ) : (
          <small>
            {contract.progress
              ? `Actualizado: ${new Date(contract.progress.updatedAt).toLocaleDateString('es-CO')}`
              : 'Contrato aun no seguido por el jugador'}
          </small>
        )}

        <Link
          className="text-link"
          to={buildContractDetailPath(catalog.id)}
        >
          Abrir guia del contrato
        </Link>
      </div>
    </Card>
  );
}
