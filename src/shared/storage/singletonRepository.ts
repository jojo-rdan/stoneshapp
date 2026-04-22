import { createPersistentResource } from '@/shared/storage/persistentResource';
import type { SingletonRepository, StoredResourceConfig } from '@/shared/storage/storage.types';

export function createSingletonRepository<TData>(
  config: StoredResourceConfig<TData>,
): SingletonRepository<TData> {
  const resource = createPersistentResource(config);

  return {
    get() {
      return resource.read();
    },
    set(value) {
      return resource.write(value);
    },
    update(updater) {
      return resource.write(updater(resource.read()));
    },
    reset() {
      return resource.reset();
    },
  };
}
