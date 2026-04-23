import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { FormField } from '@/components/forms/FormField';
import { SwitchField } from '@/components/forms/SwitchField';
import type { BuildDiscipline, PlayerProfile, PlaystylePreference } from '@/domains/player/player.types';
import type {
  PreparationChecklistItem,
  PreparationChecklistResult,
  PreparationDungeonType,
  PreparationIntent,
  PreparationPlaystyle,
  PreparationPreset,
  PreparationRunInput,
  PreparationRunType,
  PreparationWeapon,
  PreparationSupplyItem,
  PreparationSupplyCategory,
} from '@/domains/preparation/preparation.types';
import { ChecklistBucketCard } from '@/features/dungeon-prep/components/ChecklistBucketCard';
import {
  mapRecommendationToChecklistResult,
  mapRunInputToRecommendationInput,
} from '@/features/dungeon-prep/recommendation-engine/adapters';
import { generatePreparationRecommendation } from '@/features/dungeon-prep/recommendation-engine';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getActivePlayerProfile, getPlayerProfiles, updatePlayerProfile } from '@/services/profileService';
import {
  createPreparationPreset,
  getPreparationPresetById,
  getPreparationPresets,
} from '@/services/preparationService';

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

function mapPlaystyleToIntent(playstyle: PreparationPlaystyle): PreparationIntent {
  if (playstyle === 'seguro') {
    return 'segura';
  }

  if (playstyle === 'arriesgado') {
    return 'agresiva';
  }

  return 'equilibrada';
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
    dungeonKnown: true,
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

function toSupplyCategory(category?: string): PreparationSupplyCategory {
  if (
    category === 'curacion' ||
    category === 'utilidad' ||
    category === 'comida' ||
    category === 'reparacion' ||
    category === 'escape'
  ) {
    return category;
  }

  return 'utilidad';
}

function itemToSupply(item: PreparationChecklistItem, index: number, optional = false): PreparationSupplyItem {
  return {
    id: `saved-supply-${index + 1}`,
    name: item.label,
    quantity: item.quantity ?? 'x1',
    category: toSupplyCategory(item.category),
    reason: item.reason,
    optional,
  };
}

function createPresetFromForm(
  form: PreparationRunInput,
  name: string,
  result: PreparationChecklistResult | null,
): Omit<PreparationPreset, 'id'> {
  const essentials = result?.essentials ?? [];
  const recommended = result?.recommended ?? [];
  const optional = result?.optional ?? [];
  const fallbackSupply: PreparationSupplyItem = {
    id: 'saved-supply-basic',
    name: 'Kit base',
    quantity: 'x1',
    category: 'utilidad',
    reason: 'Preset guardado antes de generar una checklist detallada.',
  };

  return {
    profileId: form.profileId,
    name: name.trim() || `Preset ${form.build} - ${form.dungeonType}`,
    intent: mapPlaystyleToIntent(form.playstyle),
    description: `Preset local para ${form.runType} en ${form.dungeonType}, distancia ${form.distance}.`,
    budgetEstimate: 250 + form.level * 15 + (form.distance === 'larga' ? 120 : 0),
    recommendedFor: [form.dungeonType, form.runType, `distancia ${form.distance}`],
    supplies:
      essentials.length + recommended.length + optional.length > 0
        ? [
            ...essentials.map((item, index) => itemToSupply(item, index)),
            ...recommended.map((item, index) => itemToSupply(item, essentials.length + index)),
            ...optional.map((item, index) => itemToSupply(item, essentials.length + recommended.length + index, true)),
          ]
        : [fallbackSupply],
    checklist:
      essentials.length + recommended.length > 0
        ? [...essentials, ...recommended].map((item) => item.label)
        : ['Revisar equipo', 'Confirmar ruta de regreso', 'Reservar espacio para botin'],
    fallbackPlan: form.caravanNearby
      ? 'Si el gasto sube demasiado, volver a la caravana y reevaluar consumibles.'
      : 'Si la run se alarga, cortar antes de comprometer curacion clave.',
  };
}

export function PrepareRunPage() {
  useDocumentTitle('Preparar salida');

  const [profiles, setProfiles] = useState<PlayerProfile[]>(getPlayerProfiles());
  const [presets, setPresets] = useState<PreparationPreset[]>(getPreparationPresets());
  const persistedActiveProfile = profiles.length > 0 ? getActivePlayerProfile() : undefined;
  const activeProfile = profiles.find((profile) => profile.id === persistedActiveProfile?.id) ?? profiles[0];
  const [form, setForm] = useState<PreparationRunInput | null>(activeProfile ? createInitialForm(activeProfile) : null);
  const [presetName, setPresetName] = useState(activeProfile ? `Preset ${activeProfile.nickname}` : '');
  const [errors, setErrors] = useState<PreparationFormErrors>({});
  const [result, setResult] = useState<PreparationChecklistResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('Carga el perfil activo y genera una checklist cuando quieras.');

  if (!form || !activeProfile) {
    return (
      <Section
        title="Preparar salida"
        description="Necesitas al menos un perfil local para guardar presets de preparacion."
      >
        <EmptyState
          title="Sin perfil disponible"
          description="Crea un perfil desde la pantalla Perfil para empezar a preparar salidas persistidas."
        />
      </Section>
    );
  }

  const currentForm = form;
  const selectedProfile = profiles.find((profile) => profile.id === currentForm.profileId) ?? activeProfile;
  const profilePresets = presets.filter((preset) => preset.profileId === selectedProfile.id);
  const activePreset = getPreparationPresetById(selectedProfile.activePreparationPresetId);

  function refreshData(nextProfileId = currentForm.profileId) {
    const nextProfiles = getPlayerProfiles();
    setProfiles(nextProfiles);
    setPresets(getPreparationPresets());
    const nextActiveProfile = nextProfiles.length > 0 ? getActivePlayerProfile() : undefined;

    const nextProfile =
      nextProfiles.find((profile) => profile.id === nextProfileId) ??
      nextProfiles.find((profile) => profile.id === nextActiveProfile?.id) ??
      nextProfiles[0];

    if (nextProfile) {
      setForm((current) => ({
        ...createInitialForm(nextProfile),
        ...(current?.profileId === nextProfile.id ? current : {}),
        profileId: nextProfile.id,
      }));
    }
  }

  function handleProfileChange(profileId: string) {
    const nextProfile = profiles.find((profile) => profile.id === profileId);

    if (!nextProfile) {
      return;
    }

    setForm(createInitialForm(nextProfile));
    setPresetName(`Preset ${nextProfile.nickname}`);
    setErrors({});
    setResult(null);
    setStatusMessage('Perfil cargado desde persistencia local.');
  }

  function handleFieldChange<K extends keyof PreparationRunInput>(field: K, value: PreparationRunInput[K]) {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleLoadPreset(preset: PreparationPreset) {
    const nextProfile = profiles.find((profile) => profile.id === preset.profileId) ?? selectedProfile;

    setForm({
      ...createInitialForm(nextProfile),
      profileId: preset.profileId,
    });
    setPresetName(preset.name);
    setResult(null);
    setStatusMessage(`Preset "${preset.name}" cargado para editar la siguiente salida.`);
  }

  function handleGenerateChecklist() {
    const nextErrors = validateForm(currentForm);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setResult(null);
      return;
    }

    const recommendation = generatePreparationRecommendation(mapRunInputToRecommendationInput(currentForm));
    const nextResult = mapRecommendationToChecklistResult(recommendation);

    setResult(nextResult);
    setStatusMessage('Checklist generada con el recommendation engine v1. Puedes guardarla como preset.');
  }

  function handleSavePreset() {
    const nextErrors = validateForm(currentForm);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage('Revisa los datos de la run antes de guardar el preset.');
      return;
    }

    const createdPreset = createPreparationPreset(createPresetFromForm(currentForm, presetName, result));
    updatePlayerProfile(currentForm.profileId, {
      activePreparationPresetId: createdPreset.id,
    });
    refreshData(currentForm.profileId);
    setPresetName(createdPreset.name);
    setStatusMessage(`Preset "${createdPreset.name}" guardado y marcado como activo para este perfil.`);
  }

  return (
    <div className="page-stack">
      <Section
        title="Datos de la run"
        description="Carga el perfil activo, ajusta la salida y guarda presets persistidos para reutilizarlos."
      >
        <Card
          title="Formulario de preparacion"
          subtitle={`Perfil activo actual: ${activeProfile.nickname}`}
        >
          <div className="form-grid">
            <FormField
              label="Perfil"
              error={errors.profileId}
            >
              <select
                value={currentForm.profileId}
                onChange={(event) => handleProfileChange(event.target.value)}
              >
                {profiles.map((profile) => (
                  <option
                    key={profile.id}
                    value={profile.id}
                  >
                    {profile.nickname} - {profile.buildName}
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
                value={currentForm.level}
                onChange={(event) => handleFieldChange('level', Number(event.target.value))}
              />
            </FormField>

            <FormField
              label="Build"
              error={errors.build}
            >
              <input
                type="text"
                value={currentForm.build}
                onChange={(event) => handleFieldChange('build', event.target.value)}
              />
            </FormField>

            <FormField label="Arma principal">
              <select
                value={currentForm.mainWeapon}
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
                value={currentForm.runType}
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
                value={currentForm.distance}
                onChange={(event) => handleFieldChange('distance', event.target.value as PreparationRunInput['distance'])}
              >
                <option value="corta">corta</option>
                <option value="media">media</option>
                <option value="larga">larga</option>
              </select>
            </FormField>

            <FormField label="Tipo de dungeon">
              <select
                value={currentForm.dungeonType}
                onChange={(event) => handleFieldChange('dungeonType', event.target.value as PreparationDungeonType)}
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
                value={currentForm.playstyle}
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
                value={currentForm.freeSlots}
                onChange={(event) => handleFieldChange('freeSlots', Number(event.target.value))}
              />
            </FormField>
          </div>

          <div className="form-grid form-grid--toggles">
            <SwitchField
              label="Dungeon conocida"
              description="Desactivalo si todavia no sabes que esperar dentro."
              checked={currentForm.dungeonKnown}
              onChange={(checked) => handleFieldChange('dungeonKnown', checked)}
            />
            <SwitchField
              label="Usa magia"
              description="Marca si la run depende de recursos magicos."
              checked={currentForm.usesMagic}
              onChange={(checked) => handleFieldChange('usesMagic', checked)}
            />
            <SwitchField
              label="Caravana cerca"
              description="Indica si hay apoyo logistico relativamente proximo."
              checked={currentForm.caravanNearby}
              onChange={(checked) => handleFieldChange('caravanNearby', checked)}
            />
          </div>

          <div className="button-row">
            <Button onClick={handleGenerateChecklist}>Generar checklist</Button>
          </div>
          <p className="muted-copy">{statusMessage}</p>
        </Card>
      </Section>

      <Section
        title="Presets guardados"
        description="Presets persistidos por perfil. El ultimo que guardes queda como preset activo del perfil."
      >
        <div className="card-grid card-grid--wide">
          <Card
            title="Guardar preset"
            subtitle="Convierte el formulario actual en un preset reutilizable."
          >
            <FormField label="Nombre del preset">
              <input
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
              />
            </FormField>
            <div className="button-row">
              <Button onClick={handleSavePreset}>Guardar preset</Button>
            </div>
            {activePreset && <p className="muted-copy">Preset activo del perfil: {activePreset.name}</p>}
          </Card>

          <Card
            title={`Presets de ${selectedProfile.nickname}`}
            subtitle="Selecciona uno para reutilizar su contexto."
          >
            {profilePresets.length > 0 ? (
              <div className="profile-list">
                {profilePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={
                      preset.id === selectedProfile.activePreparationPresetId
                        ? 'profile-list__item profile-list__item--active'
                        : 'profile-list__item'
                    }
                    onClick={() => handleLoadPreset(preset)}
                  >
                    <strong>{preset.name}</strong>
                    <span>{preset.description}</span>
                    <small>{preset.intent} - {preset.supplies.length} suministros</small>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin presets guardados"
                description="Guarda una preparacion para reutilizarla en futuras salidas de este perfil."
              />
            )}
          </Card>
        </div>
      </Section>

      <Section
        title="Resultado del engine v1"
        description="Checklist generada por reglas locales, sin IA y lista para evolucionar por versiones."
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
              subtitle="Senales que el motor detecta antes de salir."
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
              title="Resumen general"
              subtitle="Lectura breve del resultado generado por reglas."
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
