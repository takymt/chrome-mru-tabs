import { parseTabId } from "./parse";
import type { DecodeHistory, History } from "./types";

const isHistory = (value: unknown): value is History =>
  Array.isArray(value) &&
  value.every((id) => typeof id === "number" && parseTabId(id).ok) &&
  new Set(value).size === value.length;

export const decodeHistory: DecodeHistory = (value) => {
  if (!isHistory(value)) {
    return { ok: false, error: { type: "invalidStoredHistory", value } };
  }
  return { ok: true, value };
};
