import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPlayerProfiles } from '@/services/profileService';

export function ProfilePage() {
  useDocumentTitle('Perfil');

  const profiles = getPlayerProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[0]?.id ?? '');
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];

  if (!selectedProfile) {
    return null;
  }

  return (
    <div className="page-stack">
      <Section
        title="Perfiles guardados"
        description="Perfiles base del MVP para cambiar rapido de build o preparar una salida distinta."
        action={<Button variant="secondary">Crear perfil (mock)</Button>}
      >
        <div className="profile-layout">
          <Card
            title="Listado de perfiles"
            subtitle="Selecciona uno para ver su resumen."
          >
            <div className="profile-list">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  className={profile.id === selectedProfile.id ? 'profile-list__item profile-list__item--active' : 'profile-list__item'}
                  onClick={() => setSelectedProfileId(profile.id)}
                >
                  <strong>{profile.nickname}</strong>
                  <span>{profile.buildName}</span>
                  <small>{profile.homeRegion}</small>
                </button>
              ))}
            </div>
          </Card>

          <div className="page-stack">
            <Card
              title={selectedProfile.nickname}
              subtitle={`${selectedProfile.buildName} · Nivel ${selectedProfile.level}`}
              aside={selectedProfile.homeRegion}
            >
              <div className="contract-card__meta">
                <Badge>{selectedProfile.discipline}</Badge>
                <Badge tone="success">{selectedProfile.playstyle}</Badge>
              </div>
              <p>{selectedProfile.notes}</p>
              <div className="button-row">
                <Button>Editar perfil (mock)</Button>
              </div>
            </Card>

            <div className="card-grid card-grid--wide">
              <Card title="Fortalezas">
                <ul className="detail-list">
                  {selectedProfile.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </Card>

              <Card title="Puntos a vigilar">
                <ul className="detail-list">
                  {selectedProfile.weakPoints.map((weakPoint) => (
                    <li key={weakPoint}>{weakPoint}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card title="Objetivos del perfil">
              <ul className="detail-list">
                {selectedProfile.goals.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
