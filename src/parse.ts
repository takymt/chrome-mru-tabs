import type { ParseCommand, ParseTabId, ParseWindowId } from "./types";

const notImplemented = (): never => {
  throw new Error("Not implemented");
};

export const parseTabId: ParseTabId = notImplemented;
export const parseWindowId: ParseWindowId = notImplemented;
export const parseCommand: ParseCommand = notImplemented;
