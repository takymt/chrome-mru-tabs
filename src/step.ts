import { cap, forget, replace, visit } from "./history";
import type { History, Step, TabId } from "./types";

export const HISTORY_LIMIT = 50;

const remember = (history: History, id: TabId | undefined): History =>
  id === undefined ? history : cap(visit(history, id), HISTORY_LIMIT);

export const step: Step = (history, observation) => {
  switch (observation.type) {
    case "tabActivated":
      return observation.windowFocused ? remember(history, observation.tabId) : history;
    case "tabRemoved":
      return forget(history, observation.tabId);
    case "tabReplaced":
      return replace(history, observation.removedTabId, observation.addedTabId);
    case "windowFocused":
    case "started":
      return remember(history, observation.activeTabId);
    case "windowBlurred":
      return history;
  }
};
