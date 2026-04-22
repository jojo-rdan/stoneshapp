import { runHistoryEntries } from '@/domains/history/history.mocks';
import type { RunHistory } from '@/domains/history/history.types';
import type {
  CreateRunHistoryInput,
  UpdateRunHistoryInput,
} from '@/features/history/types/runHistoryPersistence.types';
import {
  createCollectionRepository,
  createLocalId,
  STORAGE_KEYS,
  STORAGE_SCHEMA_VERSION,
} from '@/shared/storage';

const historyCollectionRepository = createCollectionRepository<RunHistory>({
  key: STORAGE_KEYS.runHistory,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => runHistoryEntries,
});

export const runHistoryRepository = {
  findAll(): RunHistory[] {
    return historyCollectionRepository.findAll();
  },
  findById(runId: string): RunHistory | undefined {
    return historyCollectionRepository.findById(runId);
  },
  create(input: CreateRunHistoryInput): RunHistory {
    return historyCollectionRepository.create({
      id: createLocalId('run'),
      ...input,
    });
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
