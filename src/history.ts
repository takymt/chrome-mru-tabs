import type { Cap, Forget, Replace, Target, Visit } from "./types";

export const visit: Visit = (history, id) => [id, ...history.filter((x) => x !== id)];

export const forget: Forget = (history, id) => history.filter((x) => x !== id);

export const replace: Replace = (history, from, to) => {
  if (!history.includes(from)) {
    return history;
  }
  return history.flatMap((x) => {
    if (x === from) {
      return [to];
    }
    if (x === to) {
      return [];
    }
    return [x];
  });
};

export const cap: Cap = (history, limit) => history.slice(0, limit);

export const target: Target = (history, depth) => history[depth];
