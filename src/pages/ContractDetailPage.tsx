import { Link, useParams } from 'react-router-dom';
import { appRoutes } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatContractReward, getContractById } from '@/services/contractsService';

export function ContractDetailPage() {
  const { contractId = '' } = useParams();
  const contract = getContractById(contractId);

  useDocumentTitle(contract ? contract.title : 'Contrato no encontrado');

  if (!contract) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Contrato no encontrado"
          description="El id solicitado no existe en los mocks actuales."
        />
        <Link
          className="text-link"
          to={appRoutes.contracts}
        >
          Volver a contratos
        </Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <Section title="Resumen del contrato">
        <Card
          title={contract.locationLabel}
          subtitle={contract.rewardNotes}
          aside={formatContractReward(contract.rewardGold)}
        >
          <div className="contract-card__meta">
            <Badge tone="warning">Prioridad {contract.priority}</Badge>
            <Badge>Estado {contract.status}</Badge>
            <Badge>Riesgo {contract.dangerScore}/5</Badge>
          </div>
          <p>{contract.explanationEs}</p>
        </Card>
      </Section>

      <Section
        title="Suministros sugeridos"
        description="ContractEntry ya deja preparada la informacion minima para cruzarse con presets y recomendaciones."
      >
        <Card>
          <ul className="checklist">
            {contract.recommendedSupplies.map((supply) => (
              <li key={supply}>{supply}</li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}
