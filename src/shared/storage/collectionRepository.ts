import { cloneData } from '@/shared/storage/clone';
import { createPersistentResource } from '@/shared/storage/persistentResource';
import type {
  CollectionRepository,
  LocalEntity,
  StoredResourceConfig,
} from '@/shared/storage/storage.types';

export function createCollectionRepository<TEntity extends LocalEntity>(
  config: StoredResourceConfig<TEntity[]>,
): CollectionRepository<TEntity> {
  const resource = createPersistentResource(config);

  return {
    findAll() {
      return resource.read();
    },
    findById(id) {
      return resource.read().find((entity) => entity.id === id);
    },
    create(entity) {
      const current = resource.read();
      const nextEntity = cloneData(entity);
      resource.write([...current, nextEntity]);
      return nextEntity;
    },
    update(id, updates) {
      let updatedEntity: TEntity | undefined;
      const next = resource.read().map((entity) => {
        if (entity.id !== id) {
          return entity;
        }

        updatedEntity = { ...entity, ...updates };
        return updatedEntity;
      });

      resource.write(next);
      return updatedEntity ? cloneData(updatedEntity) : undefined;
    },
    remove(id) {
      const current = resource.read();
      const next = current.filter((entity) => entity.id !== id);

      if (next.length === current.length) {
        return false;
      }

      resource.write(next);
      return true;
    },
    replaceAll(entities) {
      return resource.write(entities);
    },
    reset() {
      return resource.reset();
    },
  };
}
