import * as fc from "fast-check";
import { describe, expect, it } from "vitest";

import { decodeHistory } from "../src/decode";
import { historyArb } from "./helpers/arbitraries";
import { isValidHistory } from "./helpers/invariants";

describe("decodeHistory", () => {
  it("accepts any valid history", () => {
    fc.assert(
      fc.property(historyArb, (history) => {
        const result = decodeHistory(history);

        expect(result).toEqual({ ok: true, value: history });
      }),
    );
  });

  it.each([
    ["a non-array", "history"],
    ["undefined", undefined],
    ["null", null],
    ["an object", {}],
    ["a non-number entry", [1, "2"]],
    ["a negative entry", [1, -1]],
    ["a fractional entry", [1.5]],
    ["duplicate entries", [1, 1]],
  ])("rejects %s", (_, value) => {
    const result = decodeHistory(value);

    expect(result).toEqual({ ok: false, error: { type: "invalidStoredHistory", value } });
  });

  it("returns either a valid history or an invalid-data error for any value", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        const result = decodeHistory(value);

        const acceptable =
          (result.ok && isValidHistory(result.value)) ||
          (!result.ok && result.error.type === "invalidStoredHistory");
        expect(acceptable).toBe(true);
      }),
    );
  });
});
