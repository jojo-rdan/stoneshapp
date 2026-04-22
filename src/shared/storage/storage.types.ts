export type StorageKey = string;

export type StoredEnvelope<TData> = {
  schemaVersion: number;
  data: TData;
  seededAt: string;
  updatedAt: string;
};

export type StorageMigration<TData> = (data: unknown, fromVersion: number) => TData;

export type StoredResourceConfig<TData> = {
  key: StorageKey;
  schemaVersion: number;
  seed: () => TData;
  migrate?: StorageMigration<TData>;
};

export type StorageAdapter = {
  getItem(key: StorageKey): string | null;
  setItem(key: StorageKey, value: string): void;
  removeItem(key: StorageKey): void;
};

export type LocalEntity = {
  id: string;
};

export type CollectionRepository<TEntity extends LocalEntity> = {
  findAll(): TEntity[];
  findById(id: string): TEntity | undefined;
  create(entity: TEntity): TEntity;
  update(id: string, updates: Partial<TEntity>): TEntity | undefined;
  remove(id: string): boolean;
  replaceAll(entities: TEntity[]): TEntity[];
  reset(): TEntity[];
};

export type SingletonRepository<TData> = {
  get(): TData;
  set(value: TData): TData;
  update(updater: (current: TData) => TData): TData;
  reset(): TData;
};
