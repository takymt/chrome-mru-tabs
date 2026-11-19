import type { History } from "../../src/types";

export const hasNoDuplicates = (history: History): boolean =>
  new Set(history).size === history.length;
