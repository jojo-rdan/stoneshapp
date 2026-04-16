import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { FormField } from '@/components/forms/FormField';
import { SwitchField } from '@/components/forms/SwitchField';
import type {
  PreparationChecklistResult,
  PreparationDungeonType,
  PreparationPlaystyle,
  PreparationRunInput,
  PreparationRunType,
  PreparationWeapon,
} from '@/domains/preparation/preparation.types';
import type { BuildDiscipline, PlayerProfile, PlaystylePreference } from '@/domains/player/player.types';
import { ChecklistBucketCard } from '@/features/dungeon-prep/components/ChecklistBucketCard';
import { generateMockChecklist } from '@/features/dungeon-prep/services/mockChecklistGenerator';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPlayerProfiles } from '@/services/profileService';
import { getPreparationPresetById } from '@/services/preparationService';

type PreparationFormErrors = Partial<Record<keyof PreparationRunInput, string>>;

const runTypeOptions: PreparationRunType[] = ['contrato', 'exploracion', 'farmeo', 'jefe'];
const weaponOptions: PreparationWeapon[] = ['espada', 'hacha', 'lanza', 'daga', 'arco', 'baston'];
const dungeonOptions: PreparationDungeonType[] = ['catacumbas', 'fortin', 'cripta', 'ruinas', 'cueva'];
const playstyleOptions: PreparationPlaystyle[] = ['seguro', 'equilibrado', 'arriesgado'];

function mapDisciplineToWeapon(discipline: BuildDiscipline): PreparationWeapon {
  if (discipline === 'arco') {
    return 'arco';
  }

  if (discipline === 'lanza') {
    return 'lanza';
  }

  if (discipline === 'piromancia' || discipline === 'hibrido') {
    return 'baston';
  }

  return 'espada';
}

function mapPlaystyle(preference: PlaystylePreference): PreparationPlaystyle {
  if (preference === 'seguridad') {
    return 'seguro';
  }

  if (preference === 'farmeo') {
    return 'arriesgado';
  }

  return 'equilibrado';
}

function createInitialForm(profile: PlayerProfile): PreparationRunInput {
  return {
    profileId: profile.id,
    level: profile.level,
    build: profile.buildName,
    mainWeapon: mapDisciplineToWeapon(profile.discipline),
    usesMagic: profile.discipline === 'piromancia' || profile.discipline === 'hibrido',
    runType: 'contrato',
    distance: 'media',
    dungeonType: 'catacumbas',
    caravanNearby: true,
    playstyle: mapPlaystyle(profile.playstyle),
    freeSlots: 4,
  };
}

function validateForm(form: PreparationRunInput): PreparationFormErrors {
  const errors: PreparationFormErrors = {};

  if (!form.profileId) {
    errors.profileId = 'Selecciona un perfil.';
  }

  if (form.level < 1 || form.level > 30) {
    errors.level = 'El nivel debe estar entre 1 y 30.';
  }

  if (!form.build.trim()) {
    errors.build = 'La build no puede quedar vacia.';
  }

  if (form.freeSlots < 0 || form.freeSlots > 16) {
    errors.freeSlots = 'Los espacios libres deben estar entre 0 y 16.';
  }

  return errors;
}

export function PrepareRunPage() {
  useDocumentTitle('Preparar salida');

  const profiles = getPlayerProfiles();
  const defaultProfile = profiles[0];
  const [form, setForm] = useState<PreparationRunInput>(createInitialForm(defaultProfile));
  const [errors, setErrors] = useState<PreparationFormErrors>({});
  const [result, setResult] = useState<PreparationChecklistResult | null>(null);

  function handleProfileChange(profileId: string) {
    const nextProfile = profiles.find((profile) => profile.id === profileId);

    if (!nextProfile) {
      return;
    }

    setForm(createInitialForm(nextProfile));
    setErrors({});
  }

  function handleFieldChange<K extends keyof PreparationRunInput>(field: K, value: PreparationRunInput[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleGenerateChecklist() {
    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setResult(null);
      return;
    }

    const selectedProfile = profiles.find((profile) => profile.id === form.profileId) ?? defaultProfile;
    const selectedPreset = getPreparationPresetById(selectedProfile.activePreparationPresetId);
    const nextResult = generateMockChecklist(form, {
      profile: selectedProfile,
      preset: selectedPreset,
    });

    setResult(nextResult);
  }

  return (
    <div className="page-stack">
      <Section
        title="Datos de la run"
        description="Formulario local y mock para preparar la futura integracion del recommendation engine."
      >
        <Card>
          <div className="form-grid">
            <FormField
              label="Perfil"
              error={errors.profileId}
            >
              <select
                value={form.profileId}
                onChange={(event) => handleProfileChange(event.target.value)}
              >
                {profiles.map((profile) => (
                  <option
                    key={profile.id}
                    value={profile.id}
                  >
                    {profile.nickname} · {profile.buildName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Nivel"
              error={errors.level}
            >
              <input
                type="number"
                min={1}
                max={30}
                value={form.level}
                onChange={(event) => handleFieldChange('level', Number(event.target.value))}
              />
            </FormField>

            <FormField
              label="Build"
              error={errors.build}
            >
              <input
                type="text"
                value={form.build}
                onChange={(event) => handleFieldChange('build', event.target.value)}
              />
            </FormField>

            <FormField label="Arma principal">
              <select
                value={form.mainWeapon}
                onChange={(event) => handleFieldChange('mainWeapon', event.target.value as PreparationWeapon)}
              >
                {weaponOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Tipo de salida">
              <select
                value={form.runType}
                onChange={(event) => handleFieldChange('runType', event.target.value as PreparationRunType)}
              >
                {runTypeOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Distancia">
              <select
                value={form.distance}
                onChange={(event) => handleFieldChange('distance', event.target.value as PreparationRunInput['distance'])}
              >
                <option value="corta">corta</option>
                <option value="media">media</option>
                <option value="larga">larga</option>
              </select>
            </FormField>

            <FormField label="Tipo de dungeon">
              <select
                value={form.dungeonType}
                onChange={(event) =>
                  handleFieldChange('dungeonType', event.target.value as PreparationDungeonType)
                }
              >
                {dungeonOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Estilo de juego">
              <select
                value={form.playstyle}
                onChange={(event) => handleFieldChange('playstyle', event.target.value as PreparationPlaystyle)}
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

            <FormField
              label="Espacios libres actuales"
              error={errors.freeSlots}
            >
              <input
                type="number"
                min={0}
                max={16}
                value={form.freeSlots}
                onChange={(event) => handleFieldChange('freeSlots', Number(event.target.value))}
              />
            </FormField>
          </div>

          <div className="form-grid form-grid--toggles">
            <SwitchField
              label="Usa magia"
              description="Marca si la run depende de recursos magicos."
              checked={form.usesMagic}
              onChange={(checked) => handleFieldChange('usesMagic', checked)}
            />
            <SwitchField
              label="Caravana cerca"
              description="Indica si hay apoyo logistico relativamente proximo."
              checked={form.caravanNearby}
              onChange={(checked) => handleFieldChange('caravanNearby', checked)}
            />
          </div>

          <div className="button-row">
            <Button onClick={handleGenerateChecklist}>Generar checklist</Button>
          </div>
        </Card>
      </Section>

      <Section
        title="Resultado mock"
        description="Checklist simulada lista para ser reemplazada luego por el recommendation engine real."
      >
        {result ? (
          <div className="result-grid">
            <ChecklistBucketCard
              title="Esenciales"
              subtitle="Lo minimo para no salir corto."
              items={result.essentials}
            />
            <ChecklistBucketCard
              title="Recomendados"
              subtitle="Ayudan a estabilizar la run segun el contexto."
              items={result.recommended}
            />
            <ChecklistBucketCard
              title="Opcionales"
              subtitle="Solo si tienes margen o buscas optimizar."
              items={result.optional}
            />
            <Card
              title="Alertas"
              subtitle="Señales simples que el mock detecta antes de salir."
            >
              <ul className="detail-list">
                {result.alerts.length > 0 ? (
                  result.alerts.map((alert) => <li key={alert}>{alert}</li>)
                ) : (
                  <li>Sin alertas fuertes para esta salida.</li>
                )}
              </ul>
            </Card>
            <Card
              title="Explicacion"
              subtitle="Resumen legible de por que se genero esta checklist."
            >
              <p>{result.explanation}</p>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="Aun no hay checklist"
            description="Completa los datos de la run y usa el boton para generar una recomendacion simulada."
          />
        )}
      </Section>
    </div>
  );
}
