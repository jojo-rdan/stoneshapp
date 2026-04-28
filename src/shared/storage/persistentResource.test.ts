import { beforeEach, describe, expect, it } from 'vitest';
import { createPersistentResource } from '@/shared/storage';
import { localStorageAdapter } from '@/shared/storage/localStorageAdapter';

const TEST_KEY = 'stoneshapp:test:persistent-resource';

describe('createPersistentResource', () => {
  beforeEach(() => {
    localStorageAdapter.removeItem(TEST_KEY);
  });

  it('seeds data when storage is empty', () => {
    const resource = createPersistentResource({
      key: TEST_KEY,
      schemaVersion: 2,
      seed: () => ({ count: 1 }),
    });

    expect(resource.read()).toEqual({ count: 1 });
  });

  it('migrates envelopes from older schema versions', () => {
    localStorageAdapter.setItem(
      TEST_KEY,
      JSON.stringify({
        schemaVersion: 1,
        seededAt: '2026-04-27T00:00:00.000Z',
        updatedAt: '2026-04-27T00:00:00.000Z',
        data: { total: 3 },
      }),
    );

    const resource = createPersistentResource({
      key: TEST_KEY,
      schemaVersion: 2,
      seed: () => ({ count: 0 }),
      migrate: (data) => {
        const legacy = data as { total?: number };
        return { count: legacy.total ?? 0 };
      },
    });

    expect(resource.read()).toEqual({ count: 3 });
  });
});
