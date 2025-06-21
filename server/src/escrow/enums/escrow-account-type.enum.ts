export const EscrowAccountType = Object.freeze({
  ESCROW: 'escrow',
  OPERATION: 'escrow-operation',
  CONFIG: 'escorw-config',
} as const);

// eslint-disable-next-line no-redeclare
export type EscrowAccountType =
  (typeof EscrowAccountType)[keyof typeof EscrowAccountType];
