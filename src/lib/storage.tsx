import * as React from 'react';

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

const memoryStorage = new Map<string, string>();

const fallbackStorage: StorageLike = {
  getString: key => memoryStorage.get(key),
  set: (key, value) => {
    memoryStorage.set(key, value);
  },
  remove: (key) => {
    memoryStorage.delete(key);
  },
};

function createStorage(): StorageLike {
  try {
    // MMKV requires native Nitro modules; Expo Go may not provide them.
    const { createMMKV } = require('react-native-mmkv');
    const mmkv = createMMKV() as StorageLike;
    // Some environments resolve the module but fail on first native call.
    mmkv.getString('__storage_probe__');
    return mmkv;
  }
  catch {
    return fallbackStorage;
  }
}

export const storage = createStorage();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.remove(key);
}

export function useStoredString(
  key: string,
): readonly [string | undefined, (value?: string) => void] {
  const [value, setValue] = React.useState<string | undefined>(() => storage.getString(key));

  const setStoredValue = React.useCallback((nextValue?: string) => {
    if (nextValue === undefined) {
      storage.remove(key);
    }
    else {
      storage.set(key, nextValue);
    }
    setValue(nextValue);
  }, [key]);

  return [value, setStoredValue] as const;
}

export function useStoredBoolean(
  key: string,
): readonly [boolean | undefined, (value?: boolean) => void] {
  const [rawValue, setRawValue] = useStoredString(key);

  const value = React.useMemo(() => {
    if (rawValue === undefined)
      return undefined;
    return rawValue === 'true';
  }, [rawValue]);

  const setValue = React.useCallback((nextValue?: boolean) => {
    if (nextValue === undefined) {
      setRawValue(undefined);
      return;
    }
    setRawValue(String(nextValue));
  }, [setRawValue]);

  return [value, setValue] as const;
}
