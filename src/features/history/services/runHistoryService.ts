import {
  runFeedbackLabels,
  runFeedbackOptions,
  runHistoryResultLabels,
  runHistoryTypeLabels,
} from '@/domains/history/history.constants';
import type { RunFeedbackTag, RunHistory, RunHistoryResult, RunHistoryType } from '@/domains/history/history.types';
import { runHistoryRepository } from '@/features/history/repositories/runHistoryRepository';
import type {
  CreateRunHistoryInput,
  UpdateRunHistoryInput,
} from '@/features/history/types/runHistoryPersistence.types';

export type RunHistoryResultSummary = {
  result: RunHistoryResult;
  label: string;
  count: number;
};

export type RunHistoryFeedbackSummary = {
  tag: RunFeedbackTag;
  label: string;
  count: number;
};

export type RunHistoryInsights = {
  totalRuns: number;
  results: RunHistoryResultSummary[];
  feedback: RunHistoryFeedbackSummary[];
  recurringMissingItems: Array<{ label: string; count: number }>;
};

function sortByDateDesc(left: RunHistory, right: RunHistory) {
  return new Date(right.date).getTime() - new Date(left.date).getTime();
}

export function getRunHistory(): RunHistory[] {
  return runHistoryRepository.findAll().sort(sortByDateDesc);
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
  return runHistoryRepository.reset().sort(sortByDateDesc);
}

export function formatRunHistoryDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(date));
}

export function getRunHistoryResultLabel(result: RunHistoryResult): string {
  return runHistoryResultLabels[result];
}

export function getRunHistoryTypeLabel(runType: RunHistoryType): string {
  return runHistoryTypeLabels[runType];
}

export function getRunFeedbackLabel(tag: RunFeedbackTag): string {
  return runFeedbackLabels[tag];
}

export function getRunFeedbackOptions() {
  return runFeedbackOptions;
}

export function getRunHistoryInsights(historyEntries: RunHistory[] = getRunHistory()): RunHistoryInsights {
  const resultDefinitions: RunHistoryResult[] = ['exito', 'retiro', 'fallida', 'ajustar-preparacion'];

  const results = resultDefinitions.map((result) => ({
    result,
    label: getRunHistoryResultLabel(result),
    count: historyEntries.filter((entry) => entry.result === result).length,
  }));

  const feedback = runFeedbackOptions
    .map((option) => ({
      tag: option.value,
      label: option.label,
      count: historyEntries.filter((entry) => entry.feedbackTags.includes(option.value)).length,
    }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => right.count - left.count);

  const missingItemCounts = historyEntries.reduce<Map<string, number>>((accumulator, entry) => {
    entry.missingItems.forEach((item) => {
      accumulator.set(item, (accumulator.get(item) ?? 0) + 1);
    });
    return accumulator;
  }, new Map<string, number>());

  const recurringMissingItems = [...missingItemCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([label, count]) => ({
      label,
      count,
    }));

  return {
    totalRuns: historyEntries.length,
    results,
    feedback,
    recurringMissingItems,
  };
}
