import type { RunHistory } from '@/domains/history/history.types';
import { runHistoryRepository } from '@/features/history/repositories/runHistoryRepository';
import type {
  CreateRunHistoryInput,
  UpdateRunHistoryInput,
} from '@/features/history/types/runHistoryPersistence.types';

export function getRunHistory(): RunHistory[] {
  return runHistoryRepository.findAll();
}

export function getRunHistoryById(runId: string): RunHistory | undefined {
  return runHistoryRepository.findById(runId);
}

export function createRunHistoryEntry(input: CreateRunHistoryInput): RunHistory {
  return runHistoryRepository.create(input);
}

export function updateRunHistoryEntry(runId: string, updates: UpdateRunHistoryInput): RunHistory | undefined {
  return runHistoryRepository.update(runId, updates);
}

export function deleteRunHistoryEntry(runId: string): boolean {
  return runHistoryRepository.remove(runId);
}

export function resetRunHistory(): RunHistory[] {
  return runHistoryRepository.reset();
}
