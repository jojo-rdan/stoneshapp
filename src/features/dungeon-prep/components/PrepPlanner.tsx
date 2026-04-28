import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ContractCatalogView } from '@/domains/contracts/contract.types';
import type { RecommendationResult } from '@/domains/recommendations/recommendation.types';
import { formatContractReward } from '@/services/contractsService';

type PrepPlannerProps = {
  contract: ContractCatalogView;
  recommendation?: RecommendationResult;
};

function buildChecklistState(items: string[]) {
  return items.reduce<Record<string, boolean>>((accumulator, item) => {
    accumulator[item] = false;
    return accumulator;
  }, {});
}

function buildFallbackSupplyItems(contract: ContractCatalogView): string[] {
  const baseItems = [
    'Curacion base x3',
    contract.catalog.region === 'Brynn' ? 'Comida seca x3' : 'Comida seca x2',
    contract.catalog.objectiveType === 'bandidos' ? 'Venda extra x1' : 'Antidoto o utilidad x1',
  ];

  if (contract.catalog.tags.includes('novatos')) {
    baseItems.push('Espacio libre recomendado x3');
  }

  return baseItems;
}

function buildDefaultTravelNotes(contract: ContractCatalogView): string {
  return [
    contract.catalog.detailedDescription,
    `Prioridad para novatos: ${contract.catalog.novicePriority ?? 'sin marca especial'}.`,
  ].join(' ');
}

export function PrepPlanner({ contract, recommendation }: PrepPlannerProps) {
  const supplyItems =
    recommendation?.recommendedItems.map((item) => `${item.name} ${item.quantity}`) ??
    buildFallbackSupplyItems(contract);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() =>
    buildChecklistState(supplyItems),
  );
  const [travelNotes, setTravelNotes] = useState(buildDefaultTravelNotes(contract));

  useEffect(() => {
    // Cuando cambia el contrato reiniciamos el estado local para que el planner refleje ese contexto.
    setCheckedItems(buildChecklistState(supplyItems));
    setTravelNotes(buildDefaultTravelNotes(contract));
  }, [contract.catalog.id, contract.catalog.detailedDescription, contract.catalog.novicePriority, supplyItems]);

  const completedCount = supplyItems.filter((item) => checkedItems[item]).length;
  const missingCount = supplyItems.length - completedCount;
  const readinessBase = Math.round((completedCount / supplyItems.length) * 100);
  const readiness = recommendation ? Math.max(readinessBase, recommendation.readinessScore) : readinessBase;

  function toggleItem(item: string) {
    setCheckedItems((currentState) => ({
      ...currentState,
      [item]: !currentState[item],
    }));
  }

  function resetChecklist() {
    setCheckedItems(buildChecklistState(supplyItems));
  }

  return (
    <Card
      title="Planificador rapido"
      subtitle={`${contract.catalog.region} · ${contract.catalog.objectiveType}`}
      aside={`${readiness}% listo`}
    >
      <div className="prep-summary-grid">
        <div className="prep-summary">
          <span>Faltantes</span>
          <strong>{missingCount}</strong>
        </div>
        <div className="prep-summary">
          <span>Recompensa</span>
          <strong>{formatContractReward(contract.catalog.estimatedRewardGold)}</strong>
        </div>
        <div className="prep-summary">
          <span>Pasos sugeridos</span>
          <strong>{contract.catalog.steps.length}</strong>
        </div>
      </div>

      <div className="progress-bar">
        <span
          className="progress-bar__fill"
          style={{ width: `${readiness}%` }}
        />
      </div>

      <div className="contract-card__meta">
        <Badge tone={missingCount === 0 ? 'success' : 'warning'}>
          {missingCount === 0 ? 'Checklist completo' : `${missingCount} pendientes`}
        </Badge>
        <Badge>{contract.playerStatus}</Badge>
        {recommendation && <Badge>{recommendation.riskAssessment}</Badge>}
      </div>

      <div className="supply-list">
        {supplyItems.map((item) => (
          <label
            key={item}
            className={checkedItems[item] ? 'supply-item supply-item--checked' : 'supply-item'}
          >
            <input
              type="checkbox"
              checked={checkedItems[item] ?? false}
              onChange={() => toggleItem(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <label className="textarea-field">
        <span>Notas de la salida</span>
        <textarea
          rows={4}
          value={travelNotes}
          onChange={(event) => setTravelNotes(event.target.value)}
        />
      </label>

      <div className="button-row">
        <Button
          variant="secondary"
          onClick={resetChecklist}
        >
          Reiniciar checklist
        </Button>
        <Button
          variant="ghost"
          onClick={() => setTravelNotes(buildDefaultTravelNotes(contract))}
        >
          Restaurar nota base
        </Button>
      </div>
    </Card>
  );
}
