import { activePlayerProfileId, playerProfiles } from '@/domains/player/player.mocks';
import type { PlayerProfile } from '@/domains/player/player.types';

export function getPlayerProfiles(): PlayerProfile[] {
  return playerProfiles;
}

export function getActivePlayerProfile(): PlayerProfile {
  return playerProfiles.find((profile) => profile.id === activePlayerProfileId) ?? playerProfiles[0];
}

export function getPlayerProfileById(profileId: string): PlayerProfile | undefined {
  return playerProfiles.find((profile) => profile.id === profileId);
}
