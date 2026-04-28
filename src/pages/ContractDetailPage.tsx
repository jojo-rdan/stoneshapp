import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { appRoutes } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import type { ContractCatalogView, PlayerContractStatus } from '@/domains/contracts/contract.types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  createPlayerContractFromCatalog,
  formatContractReward,
  getContractViewById,
  updatePlayerContractNotes,
  updatePlayerContractStatus,
} from '@/services/contractsService';

function getStatusButtonVariant(status: PlayerContractStatus, currentStatus?: PlayerContractStatus) {
  return status === currentStatus ? 'primary' : 'secondary';
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

export function ContractDetailPage() {
  const { contractId = '' } = useParams();
  const initialContract = getContractViewById(contractId);
  const [contractView, setContractView] = useState<ContractCatalogView | undefined>(initialContract);
  const [userNotes, setUserNotes] = useState(initialContract?.progress?.userNotes ?? '');

  useEffect(() => {
    const nextContract = getContractViewById(contractId);
    setContractView(nextContract);
    setUserNotes(nextContract?.progress?.userNotes ?? '');
  }, [contractId]);

  useDocumentTitle(contractView ? contractView.catalog.name : 'Contrato no encontrado');

  if (!contractView) {
    return (
      <div className="page-stack">
        <EmptyState
          title="Contrato no encontrado"
          description="El contrato solicitado no existe en el catalogo curado actual."
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

  const { catalog, progress } = contractView;

  function refreshContract() {
    const nextView = getContractViewById(catalog.id);
    setContractView(nextView);
    setUserNotes(nextView?.progress?.userNotes ?? '');
  }

  function handleCreateTracking() {
    createPlayerContractFromCatalog(catalog.id);
    refreshContract();
  }

  function handleStatusChange(nextStatus: PlayerContractStatus) {
    updatePlayerContractStatus(catalog.id, nextStatus);
    refreshContract();
  }

  function handleSaveNotes() {
    updatePlayerContractNotes(catalog.id, userNotes.trim());
    refreshContract();
  }

  return (
    <div className="page-stack">
      <Section
        title={catalog.name}
        description="Una guia curada para leer rapido el contrato y un bloque separado para registrar tu progreso real como jugador."
      >
        <Card
          title={catalog.region}
          subtitle={`${catalog.objectiveType} · Lo entrega ${catalog.issuerNpc}`}
          aside={formatContractReward(catalog.estimatedRewardGold)}
        >
          <div className="contract-card__meta">
            <Badge tone={getStatusTone(contractView.playerStatus)}>{contractView.playerStatus}</Badge>
            {catalog.novicePriority && <Badge>novato: {catalog.novicePriority}</Badge>}
          </div>
          <p>{catalog.simpleDescription}</p>
          <p className="muted-copy">{catalog.tags.join(' · ')}</p>
        </Card>
      </Section>

      <div className="contract-detail-grid">
        <Card
          title="Descripcion simple"
          subtitle="Que es este contrato y por que puede ser buena o mala idea hoy."
        >
          <p>{catalog.simpleDescription}</p>
        </Card>

        <Card
          title="Explicacion detallada"
          subtitle="Lectura clara en espanol para decidir mejor la salida."
        >
          <p>{catalog.detailedDescription}</p>
        </Card>
      </div>

      <div className="contract-detail-grid">
        <Card
          title="Pasos sugeridos"
          subtitle="Secuencia simple para abordarlo con cabeza."
        >
          <ul className="detail-list">
            {catalog.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </Card>

        <Card
          title="Que esperar dentro"
          subtitle="Resumen rapido del ambiente y de la presion de la run."
        >
          <ul className="detail-list">
            {catalog.whatToExpect.map((expectation) => (
              <li key={expectation}>{expectation}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="contract-detail-grid">
        <Card
          title="Errores comunes"
          subtitle="Cosas que suelen volver cara una run aparentemente normal."
        >
          <ul className="detail-list">
            {catalog.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </Card>

        <Card
          title="Seguimiento del jugador"
          subtitle="Este bloque ya es tu progreso real, persistido localmente."
        >
          {progress ? (
            <ul className="detail-list">
              <li>Estado actual: {progress.status}</li>
              <li>Creado: {new Date(progress.createdAt).toLocaleString('es-CO')}</li>
              <li>Actualizado: {new Date(progress.updatedAt).toLocaleString('es-CO')}</li>
            </ul>
          ) : (
            <>
              <p className="muted-copy">
                Aun no has creado una instancia de seguimiento para este contrato. Hazlo cuando quieras empezar a
                registrarlo en tu tablero.
              </p>
              <div className="button-row">
                <Button onClick={handleCreateTracking}>Agregar a mis contratos</Button>
              </div>
            </>
          )}
        </Card>
      </div>

      <Section
        title="Notas del jugador"
        description="Guarda aqui lo que aprendiste, lo que te falto y la forma en que quieres retomar este contrato."
      >
        <Card>
          <label className="textarea-field">
            <span>Notas para futuras runs</span>
            <textarea
              rows={5}
              value={userNotes}
              onChange={(event) => setUserNotes(event.target.value)}
            />
          </label>

          <div className="button-row">
            {!progress && (
              <Button
                variant="secondary"
                onClick={handleCreateTracking}
              >
                Crear seguimiento primero
              </Button>
            )}
            <Button onClick={handleSaveNotes}>Guardar notas</Button>
          </div>
        </Card>
      </Section>

      <Section
        title="Cambiar estado"
        description="Marca el avance real del jugador sobre este contrato sin tocar el catalogo curado del juego."
      >
        <div className="button-row">
          <Button
            variant={getStatusButtonVariant('activo', progress?.status)}
            onClick={() => handleStatusChange('activo')}
          >
            Marcar activo
          </Button>
          <Button
            variant={getStatusButtonVariant('pausado', progress?.status)}
            onClick={() => handleStatusChange('pausado')}
          >
            Marcar pausado
          </Button>
          <Button
            variant={getStatusButtonVariant('completado', progress?.status)}
            onClick={() => handleStatusChange('completado')}
          >
            Marcar completado
          </Button>
          <Button
            variant={getStatusButtonVariant('fallido', progress?.status)}
            onClick={() => handleStatusChange('fallido')}
          >
            Marcar fallido
          </Button>
        </div>
      </Section>
    </div>
  );
}
