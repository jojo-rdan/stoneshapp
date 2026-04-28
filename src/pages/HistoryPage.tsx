import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { FormField } from '@/components/forms/FormField';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { runHistoryResultOptions, runHistoryTypeOptions } from '@/domains/history/history.constants';
import type { RunFeedbackTag, RunHistory, RunHistoryResult, RunHistoryType } from '@/domains/history/history.types';
import type { PlayerProfile } from '@/domains/player/player.types';
import { getPlayerProfiles } from '@/services/profileService';
import {
  createRunHistoryEntry,
  formatRunHistoryDate,
  getRunFeedbackLabel,
  getRunFeedbackOptions,
  getRunHistory,
  getRunHistoryInsights,
  getRunHistoryResultLabel,
  getRunHistoryTypeLabel,
} from '@/services/historyService';

type HistoryFormState = {
  profileId: string;
  date: string;
  runType: RunHistoryType;
  result: RunHistoryResult;
  label: string;
  missingItems: string;
  leftoverItems: string;
  observations: string;
  notes: string;
  feedbackTags: RunFeedbackTag[];
};

type HistoryFormErrors = Partial<Record<'profileId' | 'date' | 'label', string>>;

function getHistoryTone(result: RunHistoryResult) {
  if (result === 'exito') {
    return 'success';
  }

  if (result === 'retiro') {
    return 'warning';
  }

  return 'neutral';
}

function splitCommaValues(value: string): string[] {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function createInitialForm(profile?: PlayerProfile): HistoryFormState {
  return {
    profileId: profile?.id ?? '',
    date: new Date().toISOString().slice(0, 10),
    runType: 'contrato',
    result: 'exito',
    label: '',
    missingItems: '',
    leftoverItems: '',
    observations: '',
    notes: '',
    feedbackTags: [],
  };
}

function validateHistoryForm(form: HistoryFormState): HistoryFormErrors {
  const errors: HistoryFormErrors = {};

  if (!form.profileId) {
    errors.profileId = 'Selecciona un perfil para registrar la run.';
  }

  if (!form.date) {
    errors.date = 'La fecha es obligatoria.';
  }

  if (!form.label.trim()) {
    errors.label = 'Describe la run para reconocerla luego.';
  }

  return errors;
}

export function HistoryPage() {
  useDocumentTitle('Historial');

  const profiles = getPlayerProfiles();
  const [historyEntries, setHistoryEntries] = useState<RunHistory[]>(getRunHistory());
  const [selectedRunId, setSelectedRunId] = useState(historyEntries[0]?.id ?? '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState<'todos' | string>('todos');
  const [selectedResult, setSelectedResult] = useState<'todos' | RunHistoryResult>('todos');
  const [selectedRunType, setSelectedRunType] = useState<'todos' | RunHistoryType>('todos');
  const [selectedFeedback, setSelectedFeedback] = useState<'todos' | RunFeedbackTag>('todos');
  const [form, setForm] = useState<HistoryFormState>(createInitialForm(profiles[0]));
  const [errors, setErrors] = useState<HistoryFormErrors>({});
  const [statusMessage, setStatusMessage] = useState('Registra cómo te fue en una salida para detectar patrones útiles.');

  const feedbackOptions = getRunFeedbackOptions();
  const insights = getRunHistoryInsights(historyEntries);

  function refreshHistory(preferredRunId?: string) {
    const nextHistory = getRunHistory();
    setHistoryEntries(nextHistory);
    setSelectedRunId(preferredRunId ?? nextHistory[0]?.id ?? '');
  }

  function handleFieldChange<K extends keyof HistoryFormState>(field: K, value: HistoryFormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function toggleFeedbackTag(tag: RunFeedbackTag) {
    setForm((current) => ({
      ...current,
      feedbackTags: current.feedbackTags.includes(tag)
        ? current.feedbackTags.filter((entry) => entry !== tag)
        : [...current.feedbackTags, tag],
    }));
  }

  function handleSubmitRun() {
    const nextErrors = validateHistoryForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatusMessage('Completa los datos mínimos antes de guardar la run.');
      return;
    }

    const createdRun = createRunHistoryEntry({
      profileId: form.profileId,
      date: new Date(form.date).toISOString(),
      runType: form.runType,
      result: form.result,
      label: form.label.trim(),
      missingItems: splitCommaValues(form.missingItems),
      leftoverItems: splitCommaValues(form.leftoverItems),
      observations: form.observations.trim(),
      feedbackTags: form.feedbackTags,
      notes: form.notes.trim(),
    });

    refreshHistory(createdRun.id);
    setForm(createInitialForm(profiles.find((profile) => profile.id === form.profileId) ?? profiles[0]));
    setStatusMessage(`Run "${createdRun.label}" guardada en el historial local.`);
  }

  const filteredRuns = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return historyEntries.filter((entry) => {
      const matchesProfile = selectedProfileId === 'todos' || entry.profileId === selectedProfileId;
      const matchesResult = selectedResult === 'todos' || entry.result === selectedResult;
      const matchesRunType = selectedRunType === 'todos' || entry.runType === selectedRunType;
      const matchesFeedback = selectedFeedback === 'todos' || entry.feedbackTags.includes(selectedFeedback);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        entry.label.toLowerCase().includes(normalizedQuery) ||
        entry.observations.toLowerCase().includes(normalizedQuery) ||
        entry.notes.toLowerCase().includes(normalizedQuery) ||
        entry.missingItems.some((item) => item.toLowerCase().includes(normalizedQuery)) ||
        entry.leftoverItems.some((item) => item.toLowerCase().includes(normalizedQuery));

      return matchesProfile && matchesResult && matchesRunType && matchesFeedback && matchesQuery;
    });
  }, [historyEntries, searchQuery, selectedProfileId, selectedResult, selectedRunType, selectedFeedback]);

  const selectedRun = filteredRuns.find((entry) => entry.id === selectedRunId) ?? filteredRuns[0];

  return (
    <div className="page-stack">
      <Section
        title="Aprendizaje manual"
        description="Guarda lo que faltó, lo que sobró y cómo se sintió la run para mejorar decisiones futuras sin depender de analytics complejos."
      >
        <div className="history-insights-grid">
          <Card
            title="Runs registradas"
            aside={`${insights.totalRuns}`}
          >
            <p className="muted-copy">Base persistida localmente para alimentar decisiones futuras del recommendation engine.</p>
          </Card>

          <Card
            title="Resultado dominante"
            aside={insights.results.slice().sort((left, right) => right.count - left.count)[0]?.label ?? 'Sin datos'}
          >
            <ul className="detail-list">
              {insights.results.map((item) => (
                <li key={item.result}>
                  {item.label}: {item.count}
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Feedback recurrente"
            aside={insights.feedback[0]?.label ?? 'Sin patrón'}
          >
            {insights.feedback.length > 0 ? (
              <ul className="detail-list">
                {insights.feedback.slice(0, 3).map((item) => (
                  <li key={item.tag}>
                    {item.label}: {item.count}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-copy">Aún no hay suficiente feedback para resumir patrones.</p>
            )}
          </Card>
        </div>
      </Section>

      <Section
        title="Registrar feedback post-run"
        description="Una captura rápida después de la salida vale más que intentar recordarlo luego."
      >
        <Card
          title="Nueva run"
          subtitle="Registro manual simple, pensado para crecer después hacia recomendaciones más finas."
        >
          <div className="form-grid">
            <FormField
              label="Perfil"
              error={errors.profileId}
            >
              <select
                value={form.profileId}
                onChange={(event) => handleFieldChange('profileId', event.target.value)}
              >
                <option value="">Selecciona un perfil</option>
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
              label="Fecha"
              error={errors.date}
            >
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleFieldChange('date', event.target.value)}
              />
            </FormField>

            <FormField label="Tipo de salida">
              <select
                value={form.runType}
                onChange={(event) => handleFieldChange('runType', event.target.value as RunHistoryType)}
              >
                {runHistoryTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Resultado">
              <select
                value={form.result}
                onChange={(event) => handleFieldChange('result', event.target.value as RunHistoryResult)}
              >
                {runHistoryResultOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Nombre o referencia"
              error={errors.label}
              helperText="Ejemplo: Catacumbas del este con Alden."
            >
              <input
                type="text"
                value={form.label}
                onChange={(event) => handleFieldChange('label', event.target.value)}
              />
            </FormField>

            <FormField
              label="Faltantes"
              helperText="Sepáralos con comas: comida seca, vendas, kit de reparación"
            >
              <input
                type="text"
                value={form.missingItems}
                onChange={(event) => handleFieldChange('missingItems', event.target.value)}
              />
            </FormField>

            <FormField
              label="Sobrantes"
              helperText="Sepáralos con comas: ganzúas, espacio libre, antitoxina"
            >
              <input
                type="text"
                value={form.leftoverItems}
                onChange={(event) => handleFieldChange('leftoverItems', event.target.value)}
              />
            </FormField>
          </div>

          <FormField
            label="Feedback rápido"
            helperText="Marca las sensaciones más claras de la run."
          >
            <div className="feedback-tag-grid">
              {feedbackOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={
                    form.feedbackTags.includes(option.value)
                      ? 'feedback-tag-button feedback-tag-button--active'
                      : 'feedback-tag-button'
                  }
                  onClick={() => toggleFeedbackTag(option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </FormField>

          <div className="card-grid card-grid--wide">
            <Card title="Observaciones">
              <label className="textarea-field">
                <span>Qué pasó dentro de la run</span>
                <textarea
                  rows={4}
                  value={form.observations}
                  onChange={(event) => handleFieldChange('observations', event.target.value)}
                />
              </label>
            </Card>

            <Card title="Lectura rápida">
              <label className="textarea-field">
                <span>Conclusión para el yo del futuro</span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) => handleFieldChange('notes', event.target.value)}
                />
              </label>
            </Card>
          </div>

          <div className="button-row">
            <Button onClick={handleSubmitRun}>Guardar run</Button>
          </div>
          <p className="muted-copy">{statusMessage}</p>
        </Card>
      </Section>

      <Section
        title="Buscar y filtrar"
        description="Convierte el historial en una guía práctica de decisiones, no en una lista olvidada."
      >
        <div className="contract-filter-panel">
          <label className="form-field">
            <span className="form-field__label">Buscar</span>
            <input
              type="text"
              placeholder="Busca por nombre, observación o faltante"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span className="form-field__label">Perfil</span>
            <select
              value={selectedProfileId}
              onChange={(event) => setSelectedProfileId(event.target.value)}
            >
              <option value="todos">todos</option>
              {profiles.map((profile) => (
                <option
                  key={profile.id}
                  value={profile.id}
                >
                  {profile.nickname}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="form-field__label">Resultado</span>
            <select
              value={selectedResult}
              onChange={(event) => setSelectedResult(event.target.value as 'todos' | RunHistoryResult)}
            >
              <option value="todos">todos</option>
              {runHistoryResultOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="form-field__label">Tipo</span>
            <select
              value={selectedRunType}
              onChange={(event) => setSelectedRunType(event.target.value as 'todos' | RunHistoryType)}
            >
              <option value="todos">todos</option>
              {runHistoryTypeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span className="form-field__label">Feedback</span>
            <select
              value={selectedFeedback}
              onChange={(event) => setSelectedFeedback(event.target.value as 'todos' | RunFeedbackTag)}
            >
              <option value="todos">todos</option>
              {feedbackOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section
        title="Historial persistido"
        description="Cada run registrada queda disponible para releer patrones de faltantes, sobrantes y sensación de riesgo."
      >
        {filteredRuns.length > 0 ? (
          <div className="history-layout">
            <Card
              title="Lista de runs"
              subtitle="Selecciona una salida para revisar su lectura rápida."
            >
              <div className="history-list">
                {filteredRuns.map((entry) => {
                  const profile = profiles.find((item) => item.id === entry.profileId);

                  return (
                    <button
                      key={entry.id}
                      type="button"
                      className={
                        entry.id === selectedRun?.id ? 'history-list__item history-list__item--active' : 'history-list__item'
                      }
                      onClick={() => setSelectedRunId(entry.id)}
                    >
                      <strong>{entry.label}</strong>
                      <span>{profile?.nickname ?? 'Perfil desconocido'} · {formatRunHistoryDate(entry.date)}</span>
                      <small>{getRunHistoryResultLabel(entry.result)} · {getRunHistoryTypeLabel(entry.runType)}</small>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="page-stack">
              {selectedRun ? (
                <>
                  <Card
                    title={selectedRun.label}
                    subtitle={`${formatRunHistoryDate(selectedRun.date)} · ${profiles.find((profile) => profile.id === selectedRun.profileId)?.nickname ?? 'Perfil desconocido'}`}
                    aside={getRunHistoryTypeLabel(selectedRun.runType)}
                  >
                    <div className="contract-card__meta">
                      <Badge tone={getHistoryTone(selectedRun.result)}>{getRunHistoryResultLabel(selectedRun.result)}</Badge>
                      {selectedRun.feedbackTags.map((tag) => (
                        <Badge key={tag}>{getRunFeedbackLabel(tag)}</Badge>
                      ))}
                    </div>
                    <p className="history-summary">{selectedRun.notes || 'Sin lectura rápida guardada todavía.'}</p>
                  </Card>

                  <div className="card-grid card-grid--wide">
                    <Card title="Faltantes">
                      {selectedRun.missingItems.length > 0 ? (
                        <ul className="detail-list">
                          {selectedRun.missingItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted-copy">No registraste faltantes en esta salida.</p>
                      )}
                    </Card>

                    <Card title="Sobrantes">
                      {selectedRun.leftoverItems.length > 0 ? (
                        <ul className="detail-list">
                          {selectedRun.leftoverItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="muted-copy">No registraste sobrantes en esta salida.</p>
                      )}
                    </Card>
                  </div>

                  <div className="card-grid card-grid--wide">
                    <Card title="Observaciones">
                      <p>{selectedRun.observations || 'Sin observaciones detalladas para esta run.'}</p>
                    </Card>

                    <Card title="Patrones básicos">
                      {insights.feedback.length > 0 || insights.recurringMissingItems.length > 0 ? (
                        <ul className="detail-list">
                          {insights.feedback[0] && (
                            <li>
                              Feedback más repetido: {insights.feedback[0].label} ({insights.feedback[0].count})
                            </li>
                          )}
                          {insights.recurringMissingItems[0] && (
                            <li>
                              Faltante más repetido: {insights.recurringMissingItems[0].label} ({insights.recurringMissingItems[0].count})
                            </li>
                          )}
                          <li>Resultado de esta run: {getRunHistoryResultLabel(selectedRun.result)}</li>
                        </ul>
                      ) : (
                        <p className="muted-copy">Aún no hay suficientes runs registradas para resumir patrones.</p>
                      )}
                    </Card>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="Sin run seleccionada"
                  description="Ajusta los filtros o registra una nueva salida para empezar a aprender de tus runs."
                />
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            title="No hay runs con esos filtros"
            description="Prueba otro perfil, cambia el feedback o registra una nueva salida."
          />
        )}
      </Section>
    </div>
  );
}
