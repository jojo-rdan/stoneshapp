import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { appRoutes } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import type { ContractEntry, ContractStatus } from '@/domains/contracts/contract.types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  formatContractReward,
  getContractById,
  updateContractPersonalNotes,
  updateContractStatus,
} from '@/services/contractsService';

function getStatusButtonVariant(status: ContractStatus, currentStatus: ContractStatus) {
  return status === currentStatus ? 'primary' : 'secondary';
}

export function ContractDetailPage() {
  const { contractId = '' } = useParams();
  const initialContract = getContractById(contractId);
  const [contract, setContract] = useState<ContractEntry | undefined>(initialContract);
  const [personalNotes, setPersonalNotes] = useState(initialContract?.personalNotes ?? '');

  useEffect(() => {
    const nextContract = getContractById(contractId);
    setContract(nextContract);
    setPersonalNotes(nextContract?.personalNotes ?? '');
  }, [contractId]);

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

  const currentContract = contract;

  function handleStatusChange(nextStatus: ContractStatus) {
    const updatedContract = updateContractStatus(currentContract.id, nextStatus);

    if (updatedContract) {
      setContract(updatedContract);
      setPersonalNotes(updatedContract.personalNotes);
    }
  }

  function handleSaveNotes() {
    const updatedContract = updateContractPersonalNotes(currentContract.id, personalNotes.trim());

    if (updatedContract) {
      setContract(updatedContract);
      setPersonalNotes(updatedContract.personalNotes);
    }
  }

  return (
    <div className="page-stack">
      <Section
        title={currentContract.title}
        description="Una guia de contrato pensada para leerse rapido y ayudarte a decidir si salir ahora o prepararte mejor."
      >
        <Card
          title={currentContract.region}
          subtitle={`${currentContract.locationLabel} · Lo entrega ${currentContract.issuer}`}
          aside={formatContractReward(currentContract.rewardGold)}
        >
          <div className="contract-card__meta">
            <Badge>{currentContract.status}</Badge>
            <Badge tone="warning">Riesgo {currentContract.dangerScore}/5</Badge>
            <Badge>{currentContract.priority}</Badge>
          </div>
          <p>{currentContract.shortDescription}</p>
          <p className="muted-copy">{currentContract.rewardNotes}</p>
        </Card>
      </Section>

      <div className="contract-detail-grid">
        <Card
          title="Descripcion simple"
          subtitle="Que es este contrato y por que puede interesarte."
        >
          <p>{currentContract.explanationEs}</p>
        </Card>

        <Card
          title="Explicacion detallada"
          subtitle="Lectura en espanol para entender el tono real de la salida."
        >
          <p>{currentContract.detailedExplanationEs}</p>
        </Card>
      </div>

      <div className="contract-detail-grid">
        <Card
          title="Pasos sugeridos"
          subtitle="Secuencia simple para entrar con mas claridad."
        >
          <ul className="detail-list">
            {currentContract.suggestedSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </Card>

        <Card
          title="Que esperar dentro"
          subtitle="Resumen rapido del ambiente y de la presion de la run."
        >
          <ul className="detail-list">
            {currentContract.expectationsInside.map((expectation) => (
              <li key={expectation}>{expectation}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="contract-detail-grid">
        <Card
          title="Errores comunes"
          subtitle="Cosas que suelen volver cara una run que parecia controlada."
        >
          <ul className="detail-list">
            {currentContract.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </Card>

        <Card
          title="Suministros sugeridos"
          subtitle="Base mock para conectar luego recomendaciones y presets."
        >
          <ul className="detail-list">
            {currentContract.recommendedSupplies.map((supply) => (
              <li key={supply}>{supply}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Section
        title="Notas personales"
        description="Este bloque ya esta preparado para enlazar persistencia real mas adelante."
      >
        <Card>
          <label className="textarea-field">
            <span>Notas para futuras runs</span>
            <textarea
              rows={5}
              value={personalNotes}
              onChange={(event) => setPersonalNotes(event.target.value)}
            />
          </label>

          <div className="button-row">
            <Button onClick={handleSaveNotes}>Guardar notas</Button>
          </div>
        </Card>
      </Section>

      <Section
        title="Cambiar estado"
        description="Acciones mock para simular el flujo que luego guardaremos en persistencia."
      >
        <div className="button-row">
          <Button
            variant={getStatusButtonVariant('disponible', currentContract.status)}
            onClick={() => handleStatusChange('disponible')}
          >
            Marcar disponible
          </Button>
          <Button
            variant={getStatusButtonVariant('seguimiento', currentContract.status)}
            onClick={() => handleStatusChange('seguimiento')}
          >
            Marcar en seguimiento
          </Button>
          <Button
            variant={getStatusButtonVariant('completado', currentContract.status)}
            onClick={() => handleStatusChange('completado')}
          >
            Marcar completado
          </Button>
        </div>
      </Section>
    </div>
  );
}
