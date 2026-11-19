import * as fc from "fast-check";

import type { History, Observation, TabId } from "../../src/types";

export const tabId = (n: number): TabId => n as TabId;

// A small ID space makes collisions between generated IDs frequent.
export const tabIdArb = fc.integer({ min: 0, max: 15 }).map(tabId);

export const historyArb: fc.Arbitrary<History> = fc.uniqueArray(tabIdArb, { maxLength: 10 });

export const observationArb: fc.Arbitrary<Observation> = fc.oneof(
  fc.record({ type: fc.constant("tabActivated"), tabId: tabIdArb, windowFocused: fc.boolean() }),
  fc.record({ type: fc.constant("tabRemoved"), tabId: tabIdArb }),
  fc.record({ type: fc.constant("tabReplaced"), removedTabId: tabIdArb, addedTabId: tabIdArb }),
  fc.record({
    type: fc.constant("windowFocused"),
    activeTabId: fc.option(tabIdArb, { nil: undefined }),
  }),
  fc.record({ type: fc.constant("windowBlurred") }),
  fc.record({ type: fc.constant("started"), activeTabId: fc.option(tabIdArb, { nil: undefined }) }),
);
