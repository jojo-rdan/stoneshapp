import { Link } from 'react-router-dom';
import { appRoutes, buildContractDetailPath } from '@/app/routes';
import { Badge } from '@/components/ui/Badge';
import { getButtonClassName } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { StatCard } from '@/components/ui/StatCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatContractReward, getActivePlayerContracts, getContractCatalogViews } from '@/services/contractsService';
import { getDashboardBeginnerTips, getDashboardStats } from '@/services/dashboardService';
import { formatRunHistoryDate, getRunHistory } from '@/services/historyService';
import { getOverlaySettings } from '@/services/overlayService';
import { getActivePlayerProfile } from '@/services/profileService';
import { getPreparationPresetById } from '@/services/preparationService';
import { formatRecommendationCost, getRecommendationForContract } from '@/services/recommendationService';

export function DashboardPage() {
  useDocumentTitle('Inicio');

  const stats = getDashboardStats();
  const activeProfile = getActivePlayerProfile();
  const trackedContracts = getActivePlayerContracts();
  const recentContracts = (trackedContracts.length > 0 ? trackedContracts : getContractCatalogViews()).slice(0, 3);
  const featuredContract = recentContracts[0];
  const latestChecklistPreset = getPreparationPresetById(activeProfile.activePreparationPresetId);
  const latestRecommendation = featuredContract ? getRecommendationForContract(featuredContract.catalog.id) : undefined;
  const overlaySettings = getOverlaySettings();
  const tips = getDashboardBeginnerTips();
  const latestRun = getRunHistory()[0];

  if (!featuredContract || !latestChecklistPreset) {
    return null;
  }

  return (
    <div className="page-stack">
      <Card
        title={`Bienvenido de vuelta, ${activeProfile.nickname}`}
        subtitle="Stoneshapp resume en segundos que build tienes activa, que salida conviene preparar y donde seguir."
      >
        <p className="dashboard-hero__copy">
          Companion app en espanol para preparar dungeons, revisar contratos y mantener a mano el contexto de la
          siguiente run sin llenar la pantalla de ruido.
        </p>

        <div className="button-row">
          <Link
            className={getButtonClassName('primary')}
            to={appRoutes.prepareRun}
          >
            Preparar salida
          </Link>
          <Link
            className={getButtonClassName('secondary')}
            to={appRoutes.contracts}
          >
            Ver contratos
          </Link>
        </div>
      </Card>

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
          />
        ))}
      </section>

      <div className="dashboard-grid">
        <Card
          title="Perfil activo"
          subtitle={`${activeProfile.buildName} · ${activeProfile.homeRegion}`}
          aside={`Nivel ${activeProfile.level}`}
        >
          <div className="contract-card__meta">
            <Badge>{activeProfile.discipline}</Badge>
            <Badge tone="success">{activeProfile.playstyle}</Badge>
          </div>
          <p>{activeProfile.notes}</p>
          <ul className="detail-list">
            {activeProfile.strengths.slice(0, 3).map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </Card>

        <Card
          title="Ultima checklist generada"
          subtitle={latestChecklistPreset.name}
          aside={latestRecommendation ? formatRecommendationCost(latestRecommendation.estimatedCost) : 'Sin costo'}
        >
          <p>{latestChecklistPreset.description}</p>
          <div className="contract-card__meta">
            <Badge>{latestChecklistPreset.intent}</Badge>
            {latestRecommendation && <Badge tone="warning">{latestRecommendation.riskAssessment}</Badge>}
          </div>
          <ul className="detail-list">
            <li>{latestChecklistPreset.supplies.length} suministros base sugeridos</li>
            <li>{latestChecklistPreset.checklist.length} pasos en la checklist</li>
            <li>Contrato asociado: {featuredContract.catalog.name}</li>
          </ul>
        </Card>

        <Card
          title="Contratos activos recientes"
          subtitle="Los mas utiles para retomar rapido la sesion."
        >
          <div className="dashboard-contract-list">
            {recentContracts.map((contract) => (
              <Link
                key={contract.catalog.id}
                className="dashboard-contract-item"
                to={buildContractDetailPath(contract.catalog.id)}
              >
                <div>
                  <strong>{contract.catalog.name}</strong>
                  <p>{contract.catalog.region} · {contract.catalog.objectiveType}</p>
                </div>
                <span>{formatContractReward(contract.catalog.estimatedRewardGold)}</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card
          title="Acceso rapido al overlay"
          subtitle="Resumen del gadget de tiempo y soporte de sesion."
          aside={overlaySettings.mode}
        >
          <ul className="detail-list">
            <li>Posicion: {overlaySettings.anchor}</li>
            <li>Opacidad: {overlaySettings.opacity}%</li>
            <li>Widgets activos: {overlaySettings.widgets.filter((widget) => widget.enabled).length}</li>
          </ul>
          <p className="muted-copy">
            {latestRun
              ? `Ultima salida registrada: ${latestRun.label} · ${formatRunHistoryDate(latestRun.date)}`
              : 'Aun no hay una salida registrada en el historial.'}
          </p>
          <Link
            className={getButtonClassName('ghost')}
            to={appRoutes.overlaySettings}
          >
            Abrir overlay
          </Link>
        </Card>
      </div>

      <Section
        title="Tips para novatos"
        description="Consejos rapidos para empezar una salida con mas claridad y menos friccion."
      >
        <div className="card-grid">
          {tips.map((tip) => (
            <Card
              key={tip.id}
              title={tip.title}
            >
              <p>{tip.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
