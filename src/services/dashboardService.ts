import type { DashboardStat, DashboardTip } from '@/types/dashboard';
import { getActivePlayerContracts, getTrackedContractViews } from '@/services/contractsService';
import { formatRunHistoryDate, getRunHistory } from '@/services/historyService';
import { getActivePlayerProfile } from '@/services/profileService';
import { getRecommendationResults } from '@/services/recommendationService';

export function getDashboardStats(): DashboardStat[] {
  const activeContracts = getActivePlayerContracts();
  const trackedContracts = getTrackedContractViews();
  const activeProfile = getActivePlayerProfile();
  const recommendations = getRecommendationResults();
  const averageReadiness =
    recommendations.length > 0
      ? Math.round(
          recommendations.reduce((accumulator, result) => accumulator + result.readinessScore, 0) /
            recommendations.length,
        )
      : 0;

  return [
    {
      id: 'active-contracts',
      label: 'Contratos activos',
      value: `${activeContracts.length}`,
      hint: `${trackedContracts.length} contratos con seguimiento guardado localmente.`,
    },
    {
      id: 'profile-build',
      label: 'Build activa',
      value: activeProfile.buildName,
      hint: `Nivel ${activeProfile.level} · ${activeProfile.discipline}`,
    },
    {
      id: 'inventory-readiness',
      label: 'Preparacion media',
      value: `${averageReadiness}%`,
      hint: 'Promedio mock de resultados del recomendador.',
    },
  ];
}

export function getDashboardBeginnerTips(): DashboardTip[] {
  const activeProfile = getActivePlayerProfile();
  const [firstRecommendation] = getRecommendationResults();
  const [latestRun] = getRunHistory();

  return [
    {
      id: 'tip-read-contract',
      title: 'Lee el contrato antes de comprar',
      body: `La build ${activeProfile.buildName} rinde mejor cuando el gasto sigue el tipo de riesgo del contrato.`,
    },
    {
      id: 'tip-follow-recommendation',
      title: 'Empieza por lo prioritario',
      body: firstRecommendation
        ? 'El recomendador ya marca prioridades altas para no sobrecomprar antes de salir.'
        : 'Empieza por curacion, comida y una via clara de retirada.',
    },
    {
      id: 'tip-review-history',
      title: 'Aprende de la ultima salida',
      body: latestRun
        ? `Revisa ${latestRun.label} del ${formatRunHistoryDate(latestRun.date)} para detectar que realmente faltó o sobró.`
        : 'Empieza a registrar runs para convertir la memoria reciente en mejoras concretas.',
    },
  ];
}
