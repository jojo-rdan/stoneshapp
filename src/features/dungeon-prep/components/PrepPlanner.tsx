import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { ContractEntry } from '@/domains/contracts/contract.types';
import type { RecommendationResult } from '@/domains/recommendations/recommendation.types';
import { formatContractReward } from '@/services/contractsService';

type PrepPlannerProps = {
  contract: ContractEntry;
  recommendation?: RecommendationResult;
};

function buildChecklistState(items: string[]) {
  return items.reduce<Record<string, boolean>>((accumulator, item) => {
    accumulator[item] = false;
    return accumulator;
  }, {});
}

export function PrepPlanner({ contract, recommendation }: PrepPlannerProps) {
  const supplyItems =
    recommendation?.recommendedItems.map((item) => `${item.name} ${item.quantity}`) ??
    contract.recommendedSupplies;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() =>
    buildChecklistState(supplyItems),
  );
  const [travelNotes, setTravelNotes] = useState(contract.tacticalSummary);

  useEffect(() => {
    // Cuando cambia el contrato reiniciamos el estado local para que el planner refleje ese contexto.
    setCheckedItems(buildChecklistState(supplyItems));
    setTravelNotes(contract.tacticalSummary);
  }, [contract.id, contract.tacticalSummary, supplyItems]);

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
      subtitle={`${contract.region} · ${contract.dungeonType}`}
      aside={`${readiness}% listo`}
    >
      <div className="prep-summary-grid">
        <div className="prep-summary">
          <span>Faltantes</span>
          <strong>{missingCount}</strong>
        </div>
        <div className="prep-summary">
          <span>Recompensa</span>
          <strong>{formatContractReward(contract.rewardGold)}</strong>
        </div>
        <div className="prep-summary">
          <span>Peligro</span>
          <strong>{contract.dangerScore}/5</strong>
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
        <Badge>{contract.status}</Badge>
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
          onClick={() => setTravelNotes(contract.tacticalSummary)}
        >
          Restaurar nota base
        </Button>
      </div>
    </Card>
  );
}
