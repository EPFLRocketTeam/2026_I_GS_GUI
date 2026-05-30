export const CONFIRM_DELETE = "Delete" 
export const CANCEL_DELETE = "CANCEL" 

export type DeleteModalText =
  | typeof CONFIRM_DELETE
  | typeof CANCEL_DELETE;