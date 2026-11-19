import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { cap, forget, replace, target, visit } from "../src/history";
import type { History, TabId } from "../src/types";
import { historyArb, tabId, tabIdArb } from "./helpers/arbitraries";
import { hasNoDuplicates } from "./helpers/invariants";

const tabA = tabId(1);
const tabB = tabId(2);
const tabC = tabId(3);

describe("visit", () => {
  it("adds an ID to an empty history", () => {
    const history: History = Object.freeze([]);

    const result = visit(history, tabA);

    expect(result).toEqual([tabA]);
  });

  it("puts a new ID at the head", () => {
    const history: History = Object.freeze([tabA]);

    const result = visit(history, tabB);

    expect(result).toEqual([tabB, tabA]);
  });

  it("moves an existing ID to the head without duplicating it", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = visit(history, tabA);

    expect(result).toEqual([tabA, tabB]);
  });

  it("makes the visited ID the head", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const result = visit(Object.freeze(history), id);

        expect(result[0]).toBe(id);
      }),
    );
  });

  it("never produces duplicates", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const result = visit(Object.freeze(history), id);

        expect(hasNoDuplicates(result)).toBe(true);
      }),
    );
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const once = visit(Object.freeze(history), id);

        const twice = visit(once, id);

        expect(twice).toEqual(once);
      }),
    );
  });

  it("preserves the relative order of the other IDs", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const others = (h: History) => h.filter((x) => x !== id);

        const result = visit(Object.freeze(history), id);

        expect(others(result)).toEqual(others(history));
      }),
    );
  });

  it("commutes with relabeling the IDs", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, fc.integer({ min: 1, max: 100 }), (history, id, offset) => {
        const relabel = (x: TabId) => tabId(x + offset);

        const relabeledThenVisited = visit(Object.freeze(history.map(relabel)), relabel(id));
        const visitedThenRelabeled = visit(Object.freeze(history), id).map(relabel);

        expect(relabeledThenVisited).toEqual(visitedThenRelabeled);
      }),
    );
  });
});

describe("forget", () => {
  it("removes an ID", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = forget(history, tabA);

    expect(result).toEqual([tabB]);
  });

  it("leaves the history unchanged when the ID is absent", () => {
    const history: History = Object.freeze([tabB, tabA]);

    const result = forget(history, tabC);

    expect(result).toEqual([tabB, tabA]);
  });

  it("is idempotent", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const once = forget(Object.freeze(history), id);

        const twice = forget(once, id);

        expect(twice).toEqual(once);
      }),
    );
  });

  it("absorbs a preceding visit of the same ID", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        const frozen = Object.freeze(history);

        const result = forget(visit(frozen, id), id);

        expect(result).toEqual(forget(frozen, id));
      }),
    );
  });
});

describe("replace", () => {
  it("substitutes an ID in place", () => {
    const history: History = Object.freeze([tabC, tabA, tabB]);

    const result = replace(history, tabA, tabId(9));

    expect(result).toEqual([tabC, tabId(9), tabB]);
  });

  it("leaves the history unchanged when the replaced ID is absent", () => {
    const history: History = Object.freeze([tabC, tabB]);

    const result = replace(history, tabA, tabId(9));

    expect(result).toEqual([tabC, tabB]);
  });

  it("keeps the replacement at the replaced position when it is already present", () => {
    const history: History = Object.freeze([tabC, tabA, tabB]);

    const result = replace(history, tabA, tabB);

    expect(result).toEqual([tabC, tabB]);
  });

  it("never produces duplicates", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, tabIdArb, (history, from, to) => {
        const result = replace(Object.freeze(history), from, to);

        expect(hasNoDuplicates(result)).toBe(true);
      }),
    );
  });

  it("is undone by the inverse replacement when the replacement is new", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, tabIdArb, (history, from, to) => {
        fc.pre(!history.includes(to));

        const result = replace(replace(Object.freeze(history), from, to), to, from);

        expect(result).toEqual(history);
      }),
    );
  });
});

describe("cap", () => {
  it("keeps the newest entries", () => {
    const history: History = Object.freeze([tabC, tabB, tabA]);

    const result = cap(history, 2);

    expect(result).toEqual([tabC, tabB]);
  });

  it("never exceeds the limit", () => {
    fc.assert(
      fc.property(historyArb, fc.nat({ max: 12 }), (history, limit) => {
        const result = cap(Object.freeze(history), limit);

        expect(result.length).toBeLessThanOrEqual(limit);
      }),
    );
  });

  it("composes to the smaller limit", () => {
    fc.assert(
      fc.property(historyArb, fc.nat({ max: 12 }), fc.nat({ max: 12 }), (history, n, m) => {
        const frozen = Object.freeze(history);

        const result = cap(cap(frozen, n), m);

        expect(result).toEqual(cap(frozen, Math.min(n, m)));
      }),
    );
  });
});

describe("target", () => {
  it("returns the entry at the given depth", () => {
    const history: History = Object.freeze([tabC, tabB, tabA]);

    const atOne = target(history, 1);
    const atTwo = target(history, 2);

    expect(atOne).toBe(tabB);
    expect(atTwo).toBe(tabA);
  });

  it("returns undefined when the history is too short", () => {
    const history: History = Object.freeze([tabA]);

    const result = target(history, 1);

    expect(result).toBeUndefined();
  });

  it("returns undefined for a negative depth", () => {
    const history: History = Object.freeze([tabC, tabB, tabA]);

    const result = target(history, -1);

    expect(result).toBeUndefined();
  });

  it("returns to the previous head after visiting the target", () => {
    fc.assert(
      fc.property(historyArb, (history) => {
        const previous = target(Object.freeze(history), 1);
        fc.pre(previous !== undefined);

        const result = target(visit(history, previous), 1);

        expect(result).toBe(history[0]);
      }),
    );
  });

  it("is unaffected by forgetting an ID other than the head and the target", () => {
    fc.assert(
      fc.property(historyArb, tabIdArb, (history, id) => {
        fc.pre(id !== history[0] && id !== history[1]);

        const result = target(forget(Object.freeze(history), id), 1);

        expect(result).toBe(target(history, 1));
      }),
    );
  });
});
