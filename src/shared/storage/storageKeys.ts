const STORAGE_NAMESPACE = 'stoneshapp';

export const STORAGE_SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  profiles: `${STORAGE_NAMESPACE}:profiles`,
  preparationPresets: `${STORAGE_NAMESPACE}:preparation-presets`,
  contractsProgress: `${STORAGE_NAMESPACE}:contracts-progress`,
  playerContractProgress: `${STORAGE_NAMESPACE}:player-contract-progress`,
  runHistory: `${STORAGE_NAMESPACE}:run-history`,
  overlaySettings: `${STORAGE_NAMESPACE}:overlay-settings`,
  appSettings: `${STORAGE_NAMESPACE}:app-settings`,
  theme: `${STORAGE_NAMESPACE}-theme`,
} as const;
