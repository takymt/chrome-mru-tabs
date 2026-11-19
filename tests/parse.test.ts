import { describe, expect, it } from "vitest";

import { parseCommand, parseTabId, parseWindowId } from "../src/parse";

const TAB_ID_NONE: typeof chrome.tabs.TAB_ID_NONE = -1;
const WINDOW_ID_NONE: typeof chrome.windows.WINDOW_ID_NONE = -1;
const WINDOW_ID_CURRENT: typeof chrome.windows.WINDOW_ID_CURRENT = -2;

describe("parseTabId", () => {
  it("accepts a non-negative integer", () => {
    const result = parseTabId(5);

    expect(result).toEqual({ ok: true, value: 5 });
  });

  it.each([undefined, TAB_ID_NONE, 1.5])("rejects %s", (value) => {
    const result = parseTabId(value);

    expect(result).toEqual({ ok: false, error: { type: "invalidTabId", value } });
  });
});

describe("parseWindowId", () => {
  it("accepts a non-negative integer", () => {
    const result = parseWindowId(3);

    expect(result).toEqual({ ok: true, value: 3 });
  });

  it.each([WINDOW_ID_NONE, WINDOW_ID_CURRENT, 1.5])("rejects %s", (value) => {
    const result = parseWindowId(value);

    expect(result).toEqual({ ok: false, error: { type: "invalidWindowId", value } });
  });
});

describe("parseCommand", () => {
  it("accepts toggle", () => {
    const result = parseCommand("toggle");

    expect(result).toEqual({ ok: true, value: "toggle" });
  });

  it("rejects an unknown command", () => {
    const result = parseCommand("other");

    expect(result).toEqual({ ok: false, error: { type: "unknownCommand", name: "other" } });
  });
});
