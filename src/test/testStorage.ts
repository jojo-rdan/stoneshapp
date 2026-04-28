import { localStorageAdapter, STORAGE_KEYS } from '@/shared/storage';

export function clearStoneshappStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorageAdapter.removeItem(key);
  });
}
