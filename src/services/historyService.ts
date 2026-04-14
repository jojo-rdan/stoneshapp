import { runHistoryEntries } from '@/domains/history/history.mocks';
import type { RunHistory } from '@/domains/history/history.types';

export function getRunHistory(): RunHistory[] {
  return runHistoryEntries;
}

