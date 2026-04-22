import type { PreparationPreset } from '@/domains/preparation/preparation.types';

export type CreatePreparationPresetInput = Omit<PreparationPreset, 'id'>;

export type UpdatePreparationPresetInput = Partial<Omit<PreparationPreset, 'id'>>;
