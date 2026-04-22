import { activePlayerProfileId, playerProfiles } from '@/domains/player/player.mocks';
import type { PlayerProfile } from '@/domains/player/player.types';
import type {
  CreatePlayerProfileInput,
  ProfileStorageState,
  UpdatePlayerProfileInput,
} from '@/features/profiles/types/profilePersistence.types';
import { createLocalId, createSingletonRepository, STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/shared/storage';

const profilesStateRepository = createSingletonRepository<ProfileStorageState>({
  key: STORAGE_KEYS.profiles,
  schemaVersion: STORAGE_SCHEMA_VERSION,
  seed: () => ({
    activeProfileId: activePlayerProfileId,
    profiles: playerProfiles,
  }),
});

function normalizeActiveProfile(state: ProfileStorageState): ProfileStorageState {
  const hasActiveProfile = state.profiles.some((profile) => profile.id === state.activeProfileId);

  return {
    ...state,
    activeProfileId: hasActiveProfile ? state.activeProfileId : state.profiles[0]?.id ?? '',
  };
}

export const profilesRepository = {
  findAll(): PlayerProfile[] {
    return normalizeActiveProfile(profilesStateRepository.get()).profiles;
  },
  findById(profileId: string): PlayerProfile | undefined {
    return profilesRepository.findAll().find((profile) => profile.id === profileId);
  },
  getActive(): PlayerProfile {
    const state = normalizeActiveProfile(profilesStateRepository.get());
    return state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
  },
  create(input: CreatePlayerProfileInput): PlayerProfile {
    const profile: PlayerProfile = {
      id: createLocalId('profile'),
      ...input,
    };

    profilesStateRepository.update((current) =>
      normalizeActiveProfile({
        ...current,
        profiles: [...current.profiles, profile],
      }),
    );

    return profile;
  },
  update(profileId: string, updates: UpdatePlayerProfileInput): PlayerProfile | undefined {
    let updatedProfile: PlayerProfile | undefined;

    profilesStateRepository.update((current) =>
      normalizeActiveProfile({
        ...current,
        profiles: current.profiles.map((profile) => {
          if (profile.id !== profileId) {
            return profile;
          }

          updatedProfile = { ...profile, ...updates };
          return updatedProfile;
        }),
      }),
    );

    return updatedProfile;
  },
  remove(profileId: string): boolean {
    let removed = false;

    profilesStateRepository.update((current) => {
      const profiles = current.profiles.filter((profile) => profile.id !== profileId);
      removed = profiles.length !== current.profiles.length;

      return normalizeActiveProfile({
        ...current,
        profiles,
      });
    });

    return removed;
  },
  setActive(profileId: string): PlayerProfile | undefined {
    const profile = profilesRepository.findById(profileId);

    if (!profile) {
      return undefined;
    }

    profilesStateRepository.update((current) => ({
      ...current,
      activeProfileId: profileId,
    }));

    return profile;
  },
  reset(): PlayerProfile[] {
    return profilesStateRepository.reset().profiles;
  },
};
