import type { StorageAdapter, StorageKey } from '@/shared/storage/storage.types';

const memoryFallback = new Map<StorageKey, string>();

function getLocalStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
}

export const localStorageAdapter: StorageAdapter = {
  getItem(key) {
    return getLocalStorage()?.getItem(key) ?? memoryFallback.get(key) ?? null;
  },
  setItem(key, value) {
    const storage = getLocalStorage();

    if (storage) {
      storage.setItem(key, value);
      return;
    }

    memoryFallback.set(key, value);
  },
  removeItem(key) {
    getLocalStorage()?.removeItem(key);
    memoryFallback.delete(key);
  },
};
