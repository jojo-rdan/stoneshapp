import { Section } from '@/components/ui/Section';
import { ContractSummaryCard } from '@/features/contracts/components/ContractSummaryCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getContracts } from '@/services/contractsService';

export function ContractsPage() {
  useDocumentTitle('Contratos');

  const contracts = getContracts();

  return (
    <div className="page-stack">
      <Section
        title="Contratos activos"
        description="Cada tarjeta ya está conectada con una ruta de detalle."
      >
        <div className="card-grid">
          {contracts.map((contract) => (
            <ContractSummaryCard
              key={contract.id}
              contract={contract}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
