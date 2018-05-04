
export enum METAMASK_STATE {
  UNINSTALLED = 0,
  OPEN = 1,
  LOCKED = 2
}

export enum MovementActions {
  NONE= -1,
  DRAG= 0,
  TOP= 1,
  LEFT= 2,
  BOTTOM= 3,
  RIGHT= 4,
  UPPER_LEFT= 5,
  LOWER_LEFT= 6,
  LOWER_RIGHT= 7,
  UPPER_RIGHT= 8,
}

export enum PurchaseStage {
  NOT_STARTED= -1,
  UPLOADING_TO_IPFS= 0,
  SAVING_TO_CLOUD= 1,
  WAITING_FOR_UNLOCK= 2,
  SUBMITTING_TO_BLOCKCHAIN= 3,
  WAITING_FOR_CONFIRMATIONS= 4,
  DONE= 5
}

export enum TxType {
  PURCHASE= 0,
  AUCTION= 1,
}

export enum TxStatus {
  PENDING= 0,
  FAILED= 1,
  SUCCESS= 2,
}

export enum DragType {
  START,
  MOVE,
  STOP
}

export enum InputValidationState {
  UNKNOWN,
  ERROR,
  WARNING,
  SUCCESS
}
