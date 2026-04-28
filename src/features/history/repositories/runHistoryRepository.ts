import { runHistoryEntries } from '@/domains/history/history.mocks';
import type {
  RunFeedbackTag,
  RunHistory,
  RunHistoryResult,
  RunHistoryType,
} from '@/domains/history/history.types';
import type {
  CreateRunHistoryInput,
  UpdateRunHistoryInput,
} from '@/features/history/types/runHistoryPersistence.types';
import {
  createCollectionRepository,
  createLocalId,
  STORAGE_KEYS,
} from '@/shared/storage';

type LegacyRunOutcome = 'exito' | 'retiro' | 'ajustar-build';

type LegacyRunHistory = {
  id: string;
  profileId: string;
  contractId: string;
  runLabel: string;
  outcome: LegacyRunOutcome;
  dateLabel: string;
  durationMinutes: number;
  lootSummary: string;
  lessonsLearned: string[];
  consumedSupplies: string[];
  missingItems: string[];
  leftoverItems: string[];
  observations: string[];
  notes: string;
};

const RUN_HISTORY_SCHEMA_VERSION = 2;

const runHistoryTypes = new Set<RunHistoryType>(['contrato', 'exploracion', 'farmeo', 'jefe']);
const runHistoryResults = new Set<RunHistoryResult>(['exito', 'retiro', 'fallida', 'ajustar-preparacion']);
const runFeedbackTags = new Set<RunFeedbackTag>([
  'falto-comida',
  'falto-curacion',
  'falto-herramienta',
  'sobro-inventario',
  'run-arriesgada',
  'run-comoda',
]);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRunHistoryType(value: unknown): value is RunHistoryType {
  return typeof value === 'string' && runHistoryTypes.has(value as RunHistoryType);
}

function isRunHistoryResult(value: unknown): value is RunHistoryResult {
  return typeof value === 'string' && runHistoryResults.has(value as RunHistoryResult);
}

function isRunFeedbackTag(value: unknown): value is RunFeedbackTag {
  return typeof value === 'string' && runFeedbackTags.has(value as RunFeedbackTag);
}

function normalizeStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string').map((entry) => entry.trim()).filter(Boolean)
    : [];
}

function parseLegacyDate(dateLabel: string, index: number): string {
  const now = new Date();
  const normalized = dateLabel.toLowerCase();
  const nextDate = new Date(now);

  if (normalized.includes('2 dias')) {
    nextDate.setDate(now.getDate() - 2);
  } else if (normalized.includes('4 dias')) {
    nextDate.setDate(now.getDate() - 4);
  } else if (normalized.includes('1 semana')) {
    nextDate.setDate(now.getDate() - 7);
  } else {
    nextDate.setDate(now.getDate() - (index + 1));
  }

  return nextDate.toISOString();
}

function deriveFeedbackTagsFromLegacy(entry: LegacyRunHistory): RunFeedbackTag[] {
  const tags = new Set<RunFeedbackTag>();
  const haystack = [
    ...entry.missingItems,
    ...entry.leftoverItems,
    ...entry.observations,
    ...entry.lessonsLearned,
    entry.notes,
  ]
    .join(' ')
    .toLowerCase();

  if (haystack.includes('comida')) {
    tags.add('falto-comida');
  }

  if (haystack.includes('curacion') || haystack.includes('vend') || haystack.includes('pomada')) {
    tags.add('falto-curacion');
  }

  if (haystack.includes('kit') || haystack.includes('antitox') || haystack.includes('durabilidad')) {
    tags.add('falto-herramienta');
  }

  if (haystack.includes('hueco') || haystack.includes('inventario') || haystack.includes('espacios libres')) {
    tags.add('sobro-inventario');
  }

  if (entry.outcome === 'retiro' || entry.outcome === 'ajustar-build') {
    tags.add('run-arriesgada');
  }

  if (haystack.includes('comoda') || haystack.includes('limpia')) {
    tags.add('run-comoda');
  }

  return [...tags];
}

function normalizeRunHistoryEntry(entry: RunHistory): RunHistory {
  const parsedDate = Number.isNaN(Date.parse(entry.date)) ? new Date().toISOString() : new Date(entry.date).toISOString();

  return {
    id: entry.id,
    profileId: entry.profileId,
    date: parsedDate,
    runType: isRunHistoryType(entry.runType) ? entry.runType : 'contrato',
    result: isRunHistoryResult(entry.result) ? entry.result : 'ajustar-preparacion',
    label: entry.label.trim() || 'Salida sin nombre',
    contractCatalogId: typeof entry.contractCatalogId === 'string' && entry.contractCatalogId.trim() ? entry.contractCatalogId : undefined,
    missingItems: normalizeStringArray(entry.missingItems),
    leftoverItems: normalizeStringArray(entry.leftoverItems),
    observations: typeof entry.observations === 'string' ? entry.observations.trim() : '',
    feedbackTags: Array.isArray(entry.feedbackTags) ? entry.feedbackTags.filter(isRunFeedbackTag) : [],
    notes: typeof entry.notes === 'string' ? entry.notes.trim() : '',
  };
}

function migrateLegacyEntry(entry: LegacyRunHistory, index: number): RunHistory {
  return normalizeRunHistoryEntry({
    id: entry.id,
    profileId: entry.profileId,
    date: parseLegacyDate(entry.dateLabel, index),
    runType: 'contrato',
    result: entry.outcome === 'ajustar-build' ? 'ajustar-preparacion' : entry.outcome,
    label: entry.runLabel,
    contractCatalogId: entry.contractId,
    missingItems: entry.missingItems,
    leftoverItems: entry.leftoverItems,
    observations: entry.observations.join(' '),
    feedbackTags: deriveFeedbackTagsFromLegacy(entry),
    notes: entry.notes,
  });
}

function migrateRunHistory(data: unknown): RunHistory[] {
  if (!Array.isArray(data)) {
    return runHistoryEntries;
  }

  return data.flatMap((entry, index) => {
    if (!isObject(entry)) {
      return [];
    }

    if ('runType' in entry && 'result' in entry && 'date' in entry && 'label' in entry) {
      return [normalizeRunHistoryEntry(entry as RunHistory)];
    }

    if ('runLabel' in entry && 'outcome' in entry) {
      return [migrateLegacyEntry(entry as LegacyRunHistory, index)];
    }

    return [];
  });
}

const historyCollectionRepository = createCollectionRepository<RunHistory>({
  key: STORAGE_KEYS.runHistory,
  schemaVersion: RUN_HISTORY_SCHEMA_VERSION,
  seed: () => runHistoryEntries,
  migrate: (data) => migrateRunHistory(data),
});

export const runHistoryRepository = {
  findAll(): RunHistory[] {
    return historyCollectionRepository.findAll().map(normalizeRunHistoryEntry);
  },
  findById(runId: string): RunHistory | undefined {
    const entry = historyCollectionRepository.findById(runId);
    return entry ? normalizeRunHistoryEntry(entry) : undefined;
  },
  create(input: CreateRunHistoryInput): RunHistory {
    return historyCollectionRepository.create(
      normalizeRunHistoryEntry({
        id: createLocalId('run'),
        ...input,
      }),
    );
  },
  update(runId: string, updates: UpdateRunHistoryInput): RunHistory | undefined {
    return historyCollectionRepository.update(runId, updates);
  },
  remove(runId: string): boolean {
    return historyCollectionRepository.remove(runId);
  },
  reset(): RunHistory[] {
    return historyCollectionRepository.reset();
  },
};
