import type { DashboardStat, QuickNote } from '@/types/dashboard';
import { getContracts } from '@/services/contractsService';
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
