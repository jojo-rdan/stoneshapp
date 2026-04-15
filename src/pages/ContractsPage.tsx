import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import type { ContractRegion, ContractStatus } from '@/domains/contracts/contract.types';
import { ContractSummaryCard } from '@/features/contracts/components/ContractSummaryCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getContracts, getContractRegions, getContractStatusSummary } from '@/services/contractsService';

export function ContractsPage() {
  useDocumentTitle('Contratos');

  const contracts = getContracts();
  const statusSummary = getContractStatusSummary();
  const regions = getContractRegions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | ContractStatus>('todos');
  const [selectedRegion, setSelectedRegion] = useState<'todos' | ContractRegion>('todos');

  const filteredContracts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        contract.title.toLowerCase().includes(normalizedQuery) ||
        contract.issuer.toLowerCase().includes(normalizedQuery) ||
        contract.shortDescription.toLowerCase().includes(normalizedQuery);

      const matchesStatus = selectedStatus === 'todos' || contract.status === selectedStatus;
      const matchesRegion = selectedRegion === 'todos' || contract.region === selectedRegion;

      return matchesQuery && matchesStatus && matchesRegion;
    });
  }, [contracts, searchQuery, selectedRegion, selectedStatus]);

  return (
    <div className="page-stack">
      <Section
        title="Resumen del tablero"
        description="Vista rapida para entender cuantos contratos estan disponibles y en que punto va cada uno."
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
      </Section>

      <Section
        title="Buscar y filtrar"
        description="Encuentra rapido un contrato por nombre, estado o pueblo."
      >
        <div className="contract-filter-panel">
          <label className="form-field">
            <span className="form-field__label">Buscador</span>
            <input
              type="text"
              placeholder="Busca por contrato, NPC o descripcion"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="form-field__label">Estado</span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as 'todos' | ContractStatus)}
            >
              <option value="todos">todos</option>
              <option value="disponible">disponible</option>
              <option value="seguimiento">seguimiento</option>
              <option value="completado">completado</option>
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
        title="Lista de contratos"
        description="Cada tarjeta esta pensada como una mini guia amigable, no solo como un registro frio."
      >
        {filteredContracts.length > 0 ? (
          <div className="contract-list-grid">
            {filteredContracts.map((contract) => (
              <ContractSummaryCard
                key={contract.id}
                contract={contract}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay contratos con esos filtros"
            description="Prueba cambiando el pueblo, el estado o el texto del buscador para volver a ver resultados."
          />
        )}
      </Section>
    </div>
  );
}
