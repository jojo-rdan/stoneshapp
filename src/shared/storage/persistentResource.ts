import { cloneData } from '@/shared/storage/clone';
import { localStorageAdapter } from '@/shared/storage/localStorageAdapter';
import type {
  StorageAdapter,
  StoredEnvelope,
  StoredResourceConfig,
} from '@/shared/storage/storage.types';

type PersistentResource<TData> = {
  read(): TData;
  write(data: TData): TData;
  reset(): TData;
};

function createEnvelope<TData>(schemaVersion: number, data: TData, seededAt?: string): StoredEnvelope<TData> {
  const now = new Date().toISOString();

  return {
    schemaVersion,
    data: cloneData(data),
    seededAt: seededAt ?? now,
    updatedAt: now,
  };
}

function isStoredEnvelope<TData>(value: unknown): value is StoredEnvelope<TData> {
  return typeof value === 'object' && value !== null && 'schemaVersion' in value && 'data' in value;
}

export function createPersistentResource<TData>(
  config: StoredResourceConfig<TData>,
  adapter: StorageAdapter = localStorageAdapter,
): PersistentResource<TData> {
  function persist(data: TData, seededAt?: string): TData {
    adapter.setItem(config.key, JSON.stringify(createEnvelope(config.schemaVersion, data, seededAt)));
    return cloneData(data);
  }

  function seed(): TData {
    return persist(config.seed());
  }

  function readEnvelope(): StoredEnvelope<TData> | undefined {
    const rawValue = adapter.getItem(config.key);

    if (!rawValue) {
      return undefined;
    }

    try {
      const parsedValue = JSON.parse(rawValue) as unknown;
      return isStoredEnvelope<TData>(parsedValue) ? parsedValue : undefined;
    } catch {
      return undefined;
    }
  }

  return {
    read() {
      const envelope = readEnvelope();

      if (!envelope) {
        return seed();
      }

      if (envelope.schemaVersion === config.schemaVersion) {
        return cloneData(envelope.data);
      }

      if (config.migrate) {
        return persist(config.migrate(envelope.data, envelope.schemaVersion), envelope.seededAt);
      }

      return seed();
    },
    write(data) {
      const envelope = readEnvelope();
      return persist(data, envelope?.seededAt);
    },
    reset: seed,
  };
}
