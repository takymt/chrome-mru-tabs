import type { Cap, Forget, Replace, Target, Visit } from "./types";

const notImplemented = (): never => {
  throw new Error("Not implemented");
};

export const visit: Visit = notImplemented;
export const forget: Forget = notImplemented;
export const replace: Replace = notImplemented;
export const cap: Cap = notImplemented;
export const target: Target = notImplemented;
