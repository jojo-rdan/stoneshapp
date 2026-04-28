import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import type { ContractCatalogView, ContractRegion } from '@/domains/contracts/contract.types';
import { ContractSummaryCard } from '@/features/contracts/components/ContractSummaryCard';
import {
  filterContractCatalogViews,
  type ContractStatusFilter,
  type ContractViewMode,
} from '@/features/contracts/services/contractCatalogFilters';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  createPlayerContractFromCatalog,
  getActivePlayerContracts,
  getContractCatalogViews,
  getContractRegions,
  getContractStatusSummary,
  getTrackedContractViews,
} from '@/services/contractsService';

export function ContractsPage() {
  useDocumentTitle('Contratos');

  const [contracts, setContracts] = useState<ContractCatalogView[]>(getContractCatalogViews());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ContractStatusFilter>('todos');
  const [selectedRegion, setSelectedRegion] = useState<'todos' | ContractRegion>('todos');
  const [viewMode, setViewMode] = useState<ContractViewMode>('catalogo');

  const statusSummary = getContractStatusSummary();
  const regions = getContractRegions();
  const activeContracts = getActivePlayerContracts();
  const trackedContracts = getTrackedContractViews();

  function refreshContracts(nextViewMode: ContractViewMode = viewMode) {
    setContracts(getContractCatalogViews());
    setViewMode(nextViewMode);
  }

  function handleTrackContract(catalogId: string) {
    createPlayerContractFromCatalog(catalogId);
    refreshContracts('activos');
  }

  const filteredContracts = useMemo(() => {
    return filterContractCatalogViews({
      contracts,
      viewMode,
      searchQuery,
      selectedStatus,
      selectedRegion,
    });
  }, [contracts, searchQuery, selectedRegion, selectedStatus, viewMode]);

  return (
    <div className="page-stack">
      <Section
        title="Seguimiento del jugador"
        description="Separa claramente el catalogo curado del juego y tu progreso real sobre esos contratos."
      >
        <div className="contract-status-grid">
          {statusSummary.map((item) => (
            <article
              key={item.status}
              className="contract-status-card"
            >
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </article>
          ))}
        </div>

        <div className="button-row">
          <Button
            variant={viewMode === 'catalogo' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('catalogo')}
          >
            Catalogo curado
          </Button>
          <Button
            variant={viewMode === 'activos' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('activos')}
          >
            Activos del jugador ({activeContracts.length})
          </Button>
          <Button
            variant={viewMode === 'seguimiento' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('seguimiento')}
          >
            Todo mi seguimiento ({trackedContracts.length})
          </Button>
        </div>
      </Section>

      <Section
        title="Buscar y filtrar"
        description="Filtra por estado del jugador, pueblo o texto para convertir la guia en una herramienta real de sesion."
      >
        <div className="contract-filter-panel">
          <label className="form-field">
            <span className="form-field__label">Buscador</span>
            <input
              type="text"
              placeholder="Busca por contrato, NPC, tag o nota"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="form-field__label">Estado</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as ContractStatusFilter)}
            >
              <option value="todos">todos</option>
              <option value="sin-seguimiento">sin-seguimiento</option>
              <option value="activo">activo</option>
              <option value="pausado">pausado</option>
              <option value="completado">completado</option>
              <option value="fallido">fallido</option>
            </select>
          </label>

          <label className="form-field">
            <span className="form-field__label">Pueblo</span>
            <select
              value={selectedRegion}
              onChange={(event) => setSelectedRegion(event.target.value as 'todos' | ContractRegion)}
            >
              <option value="todos">todos</option>
              {regions.map((region) => (
                <option
                  key={region}
                  value={region}
                >
                  {region}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section
        title={
          viewMode === 'catalogo'
            ? 'Catalogo de contratos'
            : viewMode === 'activos'
              ? 'Contratos activos del jugador'
              : 'Historial de seguimiento'
        }
        description="Cada tarjeta combina la guia curada del juego con el estado real del jugador sin convertirlo en una tabla fria."
      >
        {filteredContracts.length > 0 ? (
          <div className="contract-list-grid">
            {filteredContracts.map((contract) => (
              <ContractSummaryCard
                key={contract.catalog.id}
                contract={contract}
                onTrack={handleTrackContract}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay contratos con esos filtros"
            description="Prueba otro estado, cambia de pueblo o vuelve al catalogo completo para retomar el hilo."
          />
        )}
      </Section>
    </div>
  );
}
