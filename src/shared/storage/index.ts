export { createCollectionRepository } from '@/shared/storage/collectionRepository';
export { cloneData } from '@/shared/storage/clone';
export { createLocalId } from '@/shared/storage/createLocalId';
export { localStorageAdapter } from '@/shared/storage/localStorageAdapter';
export { createPersistentResource } from '@/shared/storage/persistentResource';
export { createSingletonRepository } from '@/shared/storage/singletonRepository';
export { STORAGE_KEYS, STORAGE_SCHEMA_VERSION } from '@/shared/storage/storageKeys';
export type {
  CollectionRepository,
  LocalEntity,
  SingletonRepository,
  StorageAdapter,
  StorageKey,
  StorageMigration,
  StoredEnvelope,
  StoredResourceConfig,
} from '@/shared/storage/storage.types';
