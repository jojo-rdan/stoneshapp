import type { DashboardStat, DashboardTip, QuickNote } from '@/types/dashboard';
import { getContracts } from '@/services/contractsService';
import { getRunHistory } from '@/services/historyService';
import { getActivePlayerProfile } from '@/services/profileService';
import { getRecommendationResults } from '@/services/recommendationService';

export function getDashboardStats(): DashboardStat[] {
  const contracts = getContracts();
  const activeProfile = getActivePlayerProfile();
  const recommendations = getRecommendationResults();
  const averageReadiness = Math.round(
    recommendations.reduce((accumulator, result) => accumulator + result.readinessScore, 0) /
      recommendations.length,
  );

  return [
    {
      id: 'active-contracts',
      label: 'Contratos activos',
      value: `${contracts.length}`,
      hint: 'Base inicial del tracker para el MVP.',
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

export function getDashboardNotes(): QuickNote[] {
  const [nextContract] = getContracts();
  const activeProfile = getActivePlayerProfile();

  return [
    {
      id: 'note-route',
      title: 'Ruta sugerida',
      body: `${nextContract.region} sigue siendo la mejor salida corta para ${activeProfile.nickname}.`,
    },
    {
      id: 'note-profile',
      title: 'Foco del perfil',
      body: activeProfile.notes,
    },
    {
      id: 'note-recommendation',
      title: 'Iteracion futura',
      body: 'El recomendador ya tiene modelo propio; despues podemos sumar scoring y filtros sin rehacer la UI.',
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
        ? `El recomendador ya marca prioridades altas para no sobrecomprar antes de salir.`
        : 'Empieza por curacion, comida y una via clara de retirada.',
    },
    {
      id: 'tip-review-history',
      title: 'Aprende de la ultima salida',
      body: `Revisa ${latestRun.runLabel} para detectar que consumibles realmente se gastaron y cuales sobraron.`,
    },
  ];
}
