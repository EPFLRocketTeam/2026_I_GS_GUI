export const CONFIRM_DELETE = "Delete" as const
export const CANCEL_DELETE = "CANCEL" as const

export type DeleteModalText =
  | typeof CONFIRM_DELETE
  | typeof CANCEL_DELETE;