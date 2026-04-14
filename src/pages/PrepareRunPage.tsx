import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { LoadoutChecklist } from '@/features/dungeon-prep/components/LoadoutChecklist';
import { PrepPlanner } from '@/features/dungeon-prep/components/PrepPlanner';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getContracts } from '@/services/contractsService';
import { getActivePlayerProfile } from '@/services/profileService';
import { formatRecommendationCost, getRecommendationForContract } from '@/services/recommendationService';
import { getPreparationPresetById } from '@/services/preparationService';

export function PrepareRunPage() {
  useDocumentTitle('Preparar salida');

  const contracts = getContracts();
  const activeProfile = getActivePlayerProfile();
  const [selectedContractId, setSelectedContractId] = useState(contracts[0]?.id ?? '');
  const selectedContract = contracts.find((contract) => contract.id === selectedContractId) ?? contracts[0];
  const selectedPreset = getPreparationPresetById(activeProfile.activePreparationPresetId);
  const recommendation = selectedContract ? getRecommendationForContract(selectedContract.id) : undefined;

  if (!selectedContract || !selectedPreset) {
    return null;
  }

  return (
    <div className="page-stack">
      <Card
        title="Seleccionar contrato"
        subtitle="Primer paso del flujo: elegir la salida que quieres preparar."
      >
        <label className="select-field">
          <span>Contrato activo</span>
          <select
            value={selectedContract.id}
            onChange={(event) => setSelectedContractId(event.target.value)}
          >
            {contracts.map((contract) => (
              <option
                key={contract.id}
                value={contract.id}
              >
                {contract.title}
              </option>
            ))}
          </select>
        </label>
      </Card>

      <div className="card-grid card-grid--wide">
        <PrepPlanner
          contract={selectedContract}
          recommendation={recommendation}
        />
        <LoadoutChecklist
          title={selectedPreset.name}
          items={selectedPreset.checklist}
        />
        <Card
          title="Resultado del recomendador"
          subtitle={recommendation?.summary ?? 'Sin recomendacion directa para este contrato todavia.'}
        >
          <ul className="detail-list">
            <li>Perfil: {activeProfile.buildName}</li>
            <li>Preset: {selectedPreset.name}</li>
            <li>Costo estimado: {recommendation ? formatRecommendationCost(recommendation.estimatedCost) : 'Pendiente'}</li>
          </ul>
        </Card>
      </div>

      <Section
        title="Preparacion sugerida"
        description="Tipos y mocks listos para crecer luego hacia calculo real por build, contrato y riesgo."
      >
        <div className="card-grid">
          <Card title="Preset activo">
            <p>{selectedPreset.description}</p>
          </Card>
          <Card title="Advertencias del recomendador">
            <ul className="detail-list">
              {(recommendation?.warnings ?? [selectedPreset.fallbackPlan]).map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </Card>
          <Card title="Enemigos esperados">
            <ul className="detail-list">
              {selectedContract.enemyTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>
    </div>
  );
}
