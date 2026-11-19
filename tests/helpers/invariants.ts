import type { History } from "../../src/types";

export const hasNoDuplicates = (history: History): boolean =>
  new Set(history).size === history.length;

export const isValidHistory = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.every((id) => typeof id === "number" && Number.isInteger(id) && id >= 0) &&
  new Set(value).size === value.length;
