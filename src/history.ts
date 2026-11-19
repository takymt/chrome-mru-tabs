import type { Cap, Forget, Replace, Target, Visit } from "./types";

export const visit: Visit = (history, id) => [id, ...history.filter((x) => x !== id)];

export const forget: Forget = (history, id) => history.filter((x) => x !== id);

export const replace: Replace = (history, from, to) =>
  history.includes(from)
    ? history.flatMap((x) => (x === from ? [to] : x === to ? [] : [x]))
    : history;

export const cap: Cap = (history, limit) => history.slice(0, limit);

export const target: Target = (history, depth) => history[depth];
