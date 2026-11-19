import type { ParseCommand, ParseTabId, ParseWindowId, TabId, WindowId } from "./types";

const isId = (value: number) => Number.isInteger(value) && value >= 0;

const isTabId = (value: number | undefined): value is TabId => value !== undefined && isId(value);

const isWindowId = (value: number): value is WindowId => isId(value);

export const parseTabId: ParseTabId = (id) =>
  isTabId(id) ? { ok: true, value: id } : { ok: false, error: { type: "invalidTabId", value: id } };

export const parseWindowId: ParseWindowId = (id) =>
  isWindowId(id)
    ? { ok: true, value: id }
    : { ok: false, error: { type: "invalidWindowId", value: id } };

export const parseCommand: ParseCommand = (name) =>
  name === "toggle"
    ? { ok: true, value: name }
    : { ok: false, error: { type: "unknownCommand", name } };
