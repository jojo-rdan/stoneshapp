import type { PlayerProfile } from '@/domains/player/player.types';
import { profilesRepository } from '@/features/profiles/repositories/profilesRepository';
import type {
  CreatePlayerProfileInput,
  UpdatePlayerProfileInput,
} from '@/features/profiles/types/profilePersistence.types';

export function getPlayerProfiles(): PlayerProfile[] {
  return profilesRepository.findAll();
}

export function getActivePlayerProfile(): PlayerProfile {
  return profilesRepository.getActive();
}

export function getPlayerProfileById(profileId: string): PlayerProfile | undefined {
  return profilesRepository.findById(profileId);
}

export function createPlayerProfile(input: CreatePlayerProfileInput): PlayerProfile {
  return profilesRepository.create(input);
}

export function updatePlayerProfile(
  profileId: string,
  updates: UpdatePlayerProfileInput,
): PlayerProfile | undefined {
  return profilesRepository.update(profileId, updates);
}

export function deletePlayerProfile(profileId: string): boolean {
  return profilesRepository.remove(profileId);
}

export function setActivePlayerProfile(profileId: string): PlayerProfile | undefined {
  return profilesRepository.setActive(profileId);
}

export function resetPlayerProfiles(): PlayerProfile[] {
  return profilesRepository.reset();
}
