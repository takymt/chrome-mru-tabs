import type { ParseCommand, ParseTabId, ParseWindowId, TabId, WindowId } from "./types";

const isId = (value: number) => Number.isInteger(value) && value >= 0;

const isTabId = (value: number | undefined): value is TabId => value !== undefined && isId(value);

const isWindowId = (value: number): value is WindowId => isId(value);

export const parseTabId: ParseTabId = (id) => {
  if (!isTabId(id)) {
    return { ok: false, error: { type: "invalidTabId", value: id } };
  }
  return { ok: true, value: id };
};

export const parseWindowId: ParseWindowId = (id) => {
  if (!isWindowId(id)) {
    return { ok: false, error: { type: "invalidWindowId", value: id } };
  }
  return { ok: true, value: id };
};

export const parseCommand: ParseCommand = (name) => {
  if (name !== "toggle") {
    return { ok: false, error: { type: "unknownCommand", name } };
  }
  return { ok: true, value: name };
};
