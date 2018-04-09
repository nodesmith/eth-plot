export var METAMASK_STATE;
(function (METAMASK_STATE) {
    METAMASK_STATE[METAMASK_STATE["UNINSTALLED"] = 0] = "UNINSTALLED";
    METAMASK_STATE[METAMASK_STATE["OPEN"] = 1] = "OPEN";
    METAMASK_STATE[METAMASK_STATE["LOCKED"] = 2] = "LOCKED";
})(METAMASK_STATE || (METAMASK_STATE = {}));
;
export var MovementActions;
(function (MovementActions) {
    MovementActions[MovementActions["NONE"] = -1] = "NONE";
    MovementActions[MovementActions["DRAG"] = 0] = "DRAG";
    MovementActions[MovementActions["TOP"] = 1] = "TOP";
    MovementActions[MovementActions["LEFT"] = 2] = "LEFT";
    MovementActions[MovementActions["BOTTOM"] = 3] = "BOTTOM";
    MovementActions[MovementActions["RIGHT"] = 4] = "RIGHT";
    MovementActions[MovementActions["UPPER_LEFT"] = 5] = "UPPER_LEFT";
    MovementActions[MovementActions["LOWER_LEFT"] = 6] = "LOWER_LEFT";
    MovementActions[MovementActions["LOWER_RIGHT"] = 7] = "LOWER_RIGHT";
    MovementActions[MovementActions["UPPER_RIGHT"] = 8] = "UPPER_RIGHT";
})(MovementActions || (MovementActions = {}));
;
export var PurchaseStage;
(function (PurchaseStage) {
    PurchaseStage[PurchaseStage["NOT_STARTED"] = -1] = "NOT_STARTED";
    PurchaseStage[PurchaseStage["UPLOADING_TO_IPFS"] = 0] = "UPLOADING_TO_IPFS";
    PurchaseStage[PurchaseStage["SAVING_TO_CLOUD"] = 1] = "SAVING_TO_CLOUD";
    PurchaseStage[PurchaseStage["WAITING_FOR_UNLOCK"] = 2] = "WAITING_FOR_UNLOCK";
    PurchaseStage[PurchaseStage["SUBMITTING_TO_BLOCKCHAIN"] = 3] = "SUBMITTING_TO_BLOCKCHAIN";
    PurchaseStage[PurchaseStage["WAITING_FOR_CONFIRMATIONS"] = 4] = "WAITING_FOR_CONFIRMATIONS";
    PurchaseStage[PurchaseStage["DONE"] = 5] = "DONE";
})(PurchaseStage || (PurchaseStage = {}));
;
export var TxType;
(function (TxType) {
    TxType[TxType["PURCHASE"] = 0] = "PURCHASE";
    TxType[TxType["AUCTION"] = 1] = "AUCTION";
})(TxType || (TxType = {}));
;
export var TxStatus;
(function (TxStatus) {
    TxStatus[TxStatus["PENDING"] = 0] = "PENDING";
    TxStatus[TxStatus["FAILED"] = 1] = "FAILED";
    TxStatus[TxStatus["SUCCESS"] = 2] = "SUCCESS";
})(TxStatus || (TxStatus = {}));
//# sourceMappingURL=Enums.js.map