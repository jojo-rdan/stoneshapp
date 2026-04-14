import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { StatCard } from '@/components/ui/StatCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatContractReward, getContracts } from '@/services/contractsService';
import { getDashboardNotes, getDashboardStats } from '@/services/dashboardService';

export function DashboardPage() {
  useDocumentTitle('Inicio');

  const stats = getDashboardStats();
  const nextContract = getContracts()[0];
  const notes = getDashboardNotes();

  return (
    <div className="page-stack">
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

      <Section
        title="Siguiente contrato recomendado"
        description="El dashboard ya se alimenta de contratos y recomendaciones tipadas por dominio."
      >
        <Card
          title={nextContract.title}
          subtitle={`${nextContract.region} · ${nextContract.dungeonType}`}
          aside={formatContractReward(nextContract.rewardGold)}
        >
          <p>{nextContract.explanationEs}</p>
        </Card>
      </Section>

      <Section
        title="Notas rapidas"
        description="Recordatorios base para seguir iterando la companion app."
      >
        <div className="card-grid">
          {notes.map((note) => (
            <Card
              key={note.id}
              title={note.title}
            >
              <p>{note.body}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
