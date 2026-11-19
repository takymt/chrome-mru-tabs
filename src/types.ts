export type Result<T, E> = Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: E }>;

declare const tabIdBrand: unique symbol;
export type TabId = number & { readonly [tabIdBrand]: true };

declare const windowIdBrand: unique symbol;
export type WindowId = number & { readonly [windowIdBrand]: true };

export type History = readonly TabId[];

export type Visit = (history: History, id: TabId) => History;
export type Forget = (history: History, id: TabId) => History;
export type Replace = (history: History, from: TabId, to: TabId) => History;
export type Cap = (history: History, limit: number) => History;
export type Target = (history: History, depth: number) => TabId | undefined;

export type Command = "toggle";

export type Observation =
  | Readonly<{ type: "tabActivated"; tabId: TabId; windowFocused: boolean }>
  | Readonly<{ type: "tabRemoved"; tabId: TabId }>
  | Readonly<{ type: "tabReplaced"; removedTabId: TabId; addedTabId: TabId }>
  | Readonly<{ type: "windowFocused"; activeTabId: TabId | undefined }>
  | Readonly<{ type: "windowBlurred" }>
  | Readonly<{ type: "started"; activeTabId: TabId | undefined }>;

export type Step = (history: History, observation: Observation) => History;

export type InvalidTabId = Readonly<{ type: "invalidTabId"; value: number | undefined }>;
export type InvalidWindowId = Readonly<{ type: "invalidWindowId"; value: number }>;
export type UnknownCommand = Readonly<{ type: "unknownCommand"; name: string }>;

export type ParseTabId = (id: number | undefined) => Result<TabId, InvalidTabId>;
export type ParseWindowId = (id: number) => Result<WindowId, InvalidWindowId>;
export type ParseCommand = (name: string) => Result<Command, UnknownCommand>;

export type StorageFailed = Readonly<{ type: "storageFailed"; cause: unknown }>;
export type InvalidStoredHistory = Readonly<{ type: "invalidStoredHistory"; value: unknown }>;

export type Store = Readonly<{
  load: () => Promise<Result<History, StorageFailed | InvalidStoredHistory>>;
  save: (history: History) => Promise<Result<void, StorageFailed>>;
}>;

export type TabNotFound = Readonly<{ type: "tabNotFound"; tabId: TabId }>;

export type Activate = (id: TabId) => Promise<Result<void, TabNotFound>>;

export type Enqueue = (task: () => Promise<void>) => void;
