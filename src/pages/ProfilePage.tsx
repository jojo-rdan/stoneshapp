import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import type { BuildDiscipline, PlayerProfile, PlaystylePreference } from '@/domains/player/player.types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  createPlayerProfile,
  deletePlayerProfile,
  getActivePlayerProfile,
  getPlayerProfiles,
  setActivePlayerProfile,
  updatePlayerProfile,
} from '@/services/profileService';

type ProfileEditorState = Pick<
  PlayerProfile,
  'nickname' | 'buildName' | 'discipline' | 'level' | 'homeRegion' | 'playstyle' | 'notes'
>;

type ProfileFormErrors = Partial<Record<keyof ProfileEditorState, string>>;

const disciplineOptions: BuildDiscipline[] = ['espada-escudo', 'lanza', 'arco', 'piromancia', 'hibrido'];
const playstyleOptions: PlaystylePreference[] = ['seguridad', 'equilibrio', 'farmeo'];

function createEditorState(profile: PlayerProfile): ProfileEditorState {
  return {
    nickname: profile.nickname,
    buildName: profile.buildName,
    discipline: profile.discipline,
    level: profile.level,
    homeRegion: profile.homeRegion,
    playstyle: profile.playstyle,
    notes: profile.notes,
  };
}

function validateProfileEditor(form: ProfileEditorState): ProfileFormErrors {
  const errors: ProfileFormErrors = {};

  if (!form.nickname.trim()) {
    errors.nickname = 'El nombre del perfil es obligatorio.';
  }

  if (!form.buildName.trim()) {
    errors.buildName = 'La build no puede quedar vacia.';
  }

  if (form.level < 1 || form.level > 30) {
    errors.level = 'El nivel debe estar entre 1 y 30.';
  }

  if (!form.homeRegion.trim()) {
    errors.homeRegion = 'Indica un pueblo o region base.';
  }

  return errors;
}

function createMockProfile(sourceProfile?: PlayerProfile): Omit<PlayerProfile, 'id'> {
  return {
    nickname: sourceProfile ? `${sourceProfile.nickname} copia` : 'Nuevo aventurero',
    buildName: sourceProfile?.buildName ?? 'Build sin definir',
    discipline: sourceProfile?.discipline ?? 'espada-escudo',
    level: sourceProfile?.level ?? 1,
    homeRegion: sourceProfile?.homeRegion ?? 'Osbrook',
    playstyle: sourceProfile?.playstyle ?? 'equilibrio',
    preferredBiomes: sourceProfile ? [...sourceProfile.preferredBiomes] : ['Catacumbas', 'Fortines'],
    strengths: sourceProfile ? [...sourceProfile.strengths] : ['Perfil listo para ajustar'],
    weakPoints: sourceProfile ? [...sourceProfile.weakPoints] : ['Falta registrar experiencia real'],
    goals: sourceProfile ? [...sourceProfile.goals] : ['Crear una preparacion base persistida'],
    activePreparationPresetId: sourceProfile?.activePreparationPresetId ?? 'preset-seguro-mannshire',
    notes:
      sourceProfile?.notes ??
      'Perfil creado localmente. Edita los datos basicos para adaptarlo a tu personaje actual.',
  };
}

export function ProfilePage() {
  useDocumentTitle('Perfil');

  const [profiles, setProfiles] = useState<PlayerProfile[]>(getPlayerProfiles());
  const persistedActiveProfile = profiles.length > 0 ? getActivePlayerProfile() : undefined;
  const activeProfile = profiles.find((profile) => profile.id === persistedActiveProfile?.id) ?? profiles[0];
  const [selectedProfileId, setSelectedProfileId] = useState(activeProfile?.id ?? '');
  const selectedProfile = profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0];
  const [editor, setEditor] = useState<ProfileEditorState | null>(
    selectedProfile ? createEditorState(selectedProfile) : null,
  );
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [statusMessage, setStatusMessage] = useState('Los cambios se guardan en este dispositivo.');

  function refreshProfiles(nextSelectedProfileId?: string) {
    const nextProfiles = getPlayerProfiles();
    setProfiles(nextProfiles);

    const nextSelectedProfile =
      nextProfiles.find((profile) => profile.id === nextSelectedProfileId) ??
      nextProfiles.find((profile) => profile.id === selectedProfileId) ??
      nextProfiles[0];

    setSelectedProfileId(nextSelectedProfile?.id ?? '');
    setEditor(nextSelectedProfile ? createEditorState(nextSelectedProfile) : null);
  }

  function handleSelectProfile(profile: PlayerProfile) {
    setSelectedProfileId(profile.id);
    setEditor(createEditorState(profile));
    setErrors({});
    setStatusMessage('Perfil cargado desde persistencia local.');
  }

  function handleCreateProfile() {
    const createdProfile = createPlayerProfile(createMockProfile(selectedProfile));
    refreshProfiles(createdProfile.id);
    setStatusMessage('Perfil creado y guardado localmente.');
  }

  function handleDuplicateProfile() {
    if (!selectedProfile) {
      return;
    }

    const duplicatedProfile = createPlayerProfile(createMockProfile(selectedProfile));
    refreshProfiles(duplicatedProfile.id);
    setStatusMessage('Perfil duplicado y guardado localmente.');
  }

  function handleSetActiveProfile() {
    if (!selectedProfile) {
      return;
    }

    setActivePlayerProfile(selectedProfile.id);
    refreshProfiles(selectedProfile.id);
    setStatusMessage(`${selectedProfile.nickname} ahora es el perfil activo.`);
  }

  function handleDeleteProfile() {
    if (!selectedProfile || profiles.length <= 1) {
      return;
    }

    deletePlayerProfile(selectedProfile.id);
    refreshProfiles();
    setStatusMessage('Perfil eliminado de la persistencia local.');
  }

  function handleEditorChange<K extends keyof ProfileEditorState>(field: K, value: ProfileEditorState[K]) {
    setEditor((current) => (current ? { ...current, [field]: value } : current));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSaveProfile() {
    if (!selectedProfile || !editor) {
      return;
    }

    const nextErrors = validateProfileEditor(editor);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage('Revisa los campos marcados antes de guardar.');
      return;
    }

    updatePlayerProfile(selectedProfile.id, editor);
    refreshProfiles(selectedProfile.id);
    setStatusMessage('Perfil actualizado y guardado localmente.');
  }

  if (!selectedProfile || !editor) {
    return (
      <Section
        title="Perfiles guardados"
        description="No hay perfiles persistidos todavia."
        action={<Button onClick={handleCreateProfile}>Crear perfil inicial</Button>}
      >
        <EmptyState
          title="Sin perfiles locales"
          description="Crea un perfil para empezar a guardar preparaciones y preferencias en este dispositivo."
        />
      </Section>
    );
  }

  const isActiveProfile = activeProfile?.id === selectedProfile.id;

  return (
    <div className="page-stack">
      <Section
        title="Perfiles guardados"
        description="Perfiles persistidos localmente para cambiar rapido de build o preparar una salida distinta."
        action={<Button onClick={handleCreateProfile}>Crear perfil</Button>}
      >
        <div className="profile-layout">
          <Card
            title="Listado de perfiles"
            subtitle="Selecciona uno para ver y editar su resumen."
          >
            <div className="profile-list">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  className={
                    profile.id === selectedProfile.id ? 'profile-list__item profile-list__item--active' : 'profile-list__item'
                  }
                  onClick={() => handleSelectProfile(profile)}
                >
                  <strong>{profile.nickname}</strong>
                  <span>{profile.buildName}</span>
                  <small>
                    {profile.homeRegion}
                    {activeProfile?.id === profile.id ? ' - activo' : ''}
                  </small>
                </button>
              ))}
            </div>
          </Card>

          <div className="page-stack">
            <Card
              title={selectedProfile.nickname}
              subtitle={`${selectedProfile.buildName} - Nivel ${selectedProfile.level}`}
              aside={isActiveProfile ? 'Perfil activo' : selectedProfile.homeRegion}
            >
              <div className="contract-card__meta">
                <Badge>{selectedProfile.discipline}</Badge>
                <Badge tone="success">{selectedProfile.playstyle}</Badge>
                {isActiveProfile && <Badge tone="warning">activo</Badge>}
              </div>
              <p>{selectedProfile.notes}</p>
              <p className="muted-copy">{statusMessage}</p>
              <div className="button-row">
                <Button
                  variant={isActiveProfile ? 'primary' : 'secondary'}
                  onClick={handleSetActiveProfile}
                  disabled={isActiveProfile}
                >
                  {isActiveProfile ? 'Perfil activo' : 'Usar como activo'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDuplicateProfile}
                >
                  Duplicar perfil
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleDeleteProfile}
                  disabled={profiles.length <= 1}
                >
                  Eliminar
                </Button>
              </div>
            </Card>

            <Card
              title="Edicion basica"
              subtitle="Estos campos se guardan en la persistencia local."
            >
              <div className="form-grid">
                <FormField
                  label="Nombre"
                  error={errors.nickname}
                >
                  <input
                    value={editor.nickname}
                    onChange={(event) => handleEditorChange('nickname', event.target.value)}
                  />
                </FormField>

                <FormField
                  label="Build"
                  error={errors.buildName}
                >
                  <input
                    value={editor.buildName}
                    onChange={(event) => handleEditorChange('buildName', event.target.value)}
                  />
                </FormField>

                <FormField
                  label="Nivel"
                  error={errors.level}
                >
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={editor.level}
                    onChange={(event) => handleEditorChange('level', Number(event.target.value))}
                  />
                </FormField>

                <FormField
                  label="Region base"
                  error={errors.homeRegion}
                >
                  <input
                    value={editor.homeRegion}
                    onChange={(event) => handleEditorChange('homeRegion', event.target.value)}
                  />
                </FormField>

                <FormField label="Disciplina">
                  <select
                    value={editor.discipline}
                    onChange={(event) => handleEditorChange('discipline', event.target.value as BuildDiscipline)}
                  >
                    {disciplineOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Estilo">
                  <select
                    value={editor.playstyle}
                    onChange={(event) => handleEditorChange('playstyle', event.target.value as PlaystylePreference)}
                  >
                    {playstyleOptions.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <label className="textarea-field">
                <span>Notas</span>
                <textarea
                  rows={4}
                  value={editor.notes}
                  onChange={(event) => handleEditorChange('notes', event.target.value)}
                />
              </label>

              <div className="button-row">
                <Button onClick={handleSaveProfile}>Guardar perfil</Button>
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
