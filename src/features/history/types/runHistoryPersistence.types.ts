import type { RunHistory } from '@/domains/history/history.types';

export type CreateRunHistoryInput = Omit<RunHistory, 'id'>;

export type UpdateRunHistoryInput = Partial<Omit<RunHistory, 'id'>>;
