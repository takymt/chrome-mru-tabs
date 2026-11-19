import type { StorageArea } from "../../src/types";

export const createFakeStorageArea = (initial: Record<string, unknown> = {}) => {
  const data = new Map(Object.entries(initial));
  let failure: Error | undefined;

  const area: StorageArea = {
    get: (key) => {
      if (failure) {
        return Promise.reject(failure);
      }
      if (!data.has(key)) {
        return Promise.resolve({});
      }
      return Promise.resolve({ [key]: data.get(key) });
    },
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
