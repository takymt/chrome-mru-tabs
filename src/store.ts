import { decodeHistory } from "./decode";
import type { CreateStore } from "./types";

export const HISTORY_KEY = "history";

export const createStore: CreateStore = (area) => ({
  load: async () => {
    try {
      const items = await area.get(HISTORY_KEY);
      if (!(HISTORY_KEY in items)) {
        return { ok: true, value: [] };
      }
      return decodeHistory(items[HISTORY_KEY]);
    } catch (cause) {
      return { ok: false, error: { type: "storageFailed", cause } };
    }
  },
  save: async (history) => {
    try {
      await area.set({ [HISTORY_KEY]: history });
      return { ok: true, value: undefined };
    } catch (cause) {
      return { ok: false, error: { type: "storageFailed", cause } };
    }
  },
});
