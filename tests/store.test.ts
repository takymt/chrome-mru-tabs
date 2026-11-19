import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createStore, HISTORY_KEY } from "../src/store";
import { historyArb, tabId } from "./helpers/arbitraries";
import { createFakeStorageArea } from "./helpers/fakes";

const tabA = tabId(1);
const tabB = tabId(2);

describe("load", () => {
  it("returns an empty history when nothing is stored", async () => {
    const store = createStore(createFakeStorageArea().area);

    const result = await store.load();

    expect(result).toEqual({ ok: true, value: [] });
  });

  it("returns what was saved", async () => {
    await fc.assert(
      fc.asyncProperty(historyArb, async (history) => {
        const store = createStore(createFakeStorageArea().area);
        await store.save(history);

        const result = await store.load();

        expect(result).toEqual({ ok: true, value: history });
      }),
    );
  });

  it("reports stored data that is not a valid history", async () => {
    const store = createStore(createFakeStorageArea({ [HISTORY_KEY]: "broken" }).area);

    const result = await store.load();

    expect(result).toEqual({
      ok: false,
      error: { type: "invalidStoredHistory", value: "broken" },
    });
  });

  it("reports a failed read", async () => {
    const fake = createFakeStorageArea();
    const cause = new Error("read failed");
    fake.fail(cause);
    const store = createStore(fake.area);

    const result = await store.load();

    expect(result).toEqual({ ok: false, error: { type: "storageFailed", cause } });
  });
});

describe("save", () => {
  it("reports success", async () => {
    const store = createStore(createFakeStorageArea().area);

    const result = await store.save([tabB, tabA]);

    expect(result).toEqual({ ok: true, value: undefined });
  });

  it("reports a failed write", async () => {
    const fake = createFakeStorageArea();
    const cause = new Error("write failed");
    fake.fail(cause);
    const store = createStore(fake.area);

    const result = await store.save([tabA]);

    expect(result).toEqual({ ok: false, error: { type: "storageFailed", cause } });
  });
});
