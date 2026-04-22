import type { PlayerProfile } from '@/domains/player/player.types';

export type ProfileStorageState = {
  activeProfileId: string;
  profiles: PlayerProfile[];
};

export type CreatePlayerProfileInput = Omit<PlayerProfile, 'id'>;

export type UpdatePlayerProfileInput = Partial<Omit<PlayerProfile, 'id'>>;
