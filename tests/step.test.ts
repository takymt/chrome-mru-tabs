import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { HISTORY_LIMIT, step } from "../src/step";
import type { History } from "../src/types";
import { historyArb, observationArb, tabId } from "./helpers/arbitraries";
import { hasNoDuplicates } from "./helpers/invariants";

const tabA = tabId(1);
const tabB = tabId(2);
const tabC = tabId(3);

describe("step", () => {
  it("visits a tab activated in the focused window", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "tabActivated", tabId: tabC, windowFocused: true });

    expect(result).toEqual([tabC, tabB, tabA]);
  });

  it("ignores a tab activated in an unfocused window", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "tabActivated", tabId: tabC, windowFocused: false });

    expect(result).toEqual([tabB, tabA]);
  });

  it("forgets a removed tab", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "tabRemoved", tabId: tabA });

    expect(result).toEqual([tabB]);
  });

  it("replaces a replaced tab", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "tabReplaced", removedTabId: tabA, addedTabId: tabC });

    expect(result).toEqual([tabB, tabC]);
  });

  it("visits the active tab of a newly focused window", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "windowFocused", activeTabId: tabC });

    expect(result).toEqual([tabC, tabB, tabA]);
  });

  it("ignores a focused window without an active tab", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "windowFocused", activeTabId: undefined });

    expect(result).toEqual([tabB, tabA]);
  });

  it("ignores a blurred window", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = step(history, { type: "windowBlurred" });

    expect(result).toEqual([tabB, tabA]);
  });

  it("visits the active tab at startup", () => {
    const history: History = Object.freeze([]);

    const result = step(history, { type: "started", activeTabId: tabA });

    expect(result).toEqual([tabA]);
  });

  it("ignores startup without an active tab", () => {
    const history: History = Object.freeze([]);

    const result = step(history, { type: "started", activeTabId: undefined });

    expect(result).toEqual([]);
  });

  it("drops the oldest tab beyond the limit", () => {
    const history: History = Object.freeze(
      Array.from({ length: HISTORY_LIMIT }, (_, i) => tabId(i)),
    );
    const newest = tabId(HISTORY_LIMIT);
    const oldest = tabId(HISTORY_LIMIT - 1);

    const result = step(history, { type: "tabActivated", tabId: newest, windowFocused: true });

    expect(result).toHaveLength(HISTORY_LIMIT);
    expect(result[0]).toBe(newest);
    expect(result).not.toContain(oldest);
  });

  it("preserves the history invariants over any observation sequence", () => {
    fc.assert(
      fc.property(historyArb, fc.array(observationArb), (initial, observations) => {
        const result = observations.reduce(
          (history, observation) => step(Object.freeze(history), observation),
          initial,
        );

        expect(hasNoDuplicates(result)).toBe(true);
        expect(result.length).toBeLessThanOrEqual(HISTORY_LIMIT);
      }),
    );
  });
});
