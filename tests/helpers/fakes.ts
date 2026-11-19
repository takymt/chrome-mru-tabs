import type { StorageArea } from "../../src/types";

export const createFakeStorageArea = (initial: Record<string, unknown> = {}) => {
  const data = new Map(Object.entries(initial));
  let failure: Error | undefined;

  const area: StorageArea = {
    get: (key) =>
      failure
        ? Promise.reject(failure)
        : Promise.resolve(data.has(key) ? { [key]: data.get(key) } : {}),
    set: (items) => {
      if (failure) {
        return Promise.reject(failure);
      }
      for (const [key, value] of Object.entries(items)) {
        data.set(key, value);
      }
      return Promise.resolve();
    },
  };

  return {
    area,
    fail: (error: Error) => {
      failure = error;
    },
  };
};
