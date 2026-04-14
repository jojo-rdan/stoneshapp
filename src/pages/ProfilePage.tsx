import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getActivePlayerProfile } from '@/services/profileService';

export function ProfilePage() {
  useDocumentTitle('Perfil');

  const profile = getActivePlayerProfile();

  return (
    <div className="page-stack">
      <div className="card-grid card-grid--wide">
        <Card
          title={profile.nickname}
          subtitle={`${profile.buildName} · Nivel ${profile.level}`}
          aside={profile.homeRegion}
        >
          <p>{profile.notes}</p>
        </Card>
        <Card title="Fortalezas">
          <ul className="detail-list">
            {profile.strengths.map((focus) => (
              <li key={focus}>{focus}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Section
        title="Objetivos del perfil"
        description="PlayerProfile ya modela build, enfoque y riesgos para escalar luego hacia presets y comparaciones."
      >
        <Card>
          <ul className="detail-list">
            {profile.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section
        title="Puntos a vigilar"
        description="Zona util para conectar recomendaciones futuras por build."
      >
        <Card>
          <ul className="detail-list">
            {profile.weakPoints.map((weakPoint) => (
              <li key={weakPoint}>{weakPoint}</li>
            ))}
          </ul>
        </Card>
      </Section>
    </div>
  );
}
