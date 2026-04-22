export function cloneData<TData>(data: TData): TData {
  if (typeof structuredClone === 'function') {
    return structuredClone(data);
  }

  return JSON.parse(JSON.stringify(data)) as TData;
}
