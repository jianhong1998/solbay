export const LocalStorageKey = {
  EXAMPLE_KEY: 'example',
} as const;

export type LocalStorageKey =
  (typeof LocalStorageKey)[keyof typeof LocalStorageKey];
