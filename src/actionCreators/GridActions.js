import { ActionTypes } from '../constants/ActionTypes';
export function hoverOverPlot(plotIndex) {
    return {
        type: ActionTypes.HOVER_OVER_PLOT,
        plotIndex: plotIndex
    };
}
export function enterBuyMode() {
    return {
        type: ActionTypes.ENTER_BUY_MODE
    };
}
export function startDraggingRect(x, y) {
    return {
        type: ActionTypes.START_DRAGGING_RECT,
        x: x,
        y: y
    };
}
export function stopDraggingRect() {
    return {
        type: ActionTypes.STOP_DRAGGING_RECT
    };
}
export function resizeDraggingRect(x, y) {
    return {
        type: ActionTypes.RESIZE_DRAGGING_RECT,
        x: x,
        y: y
    };
}
export function showPurchaseDialog(rectToPurchase) {
    return {
        type: ActionTypes.SHOW_PURCHASE_DIALOG,
        rectToPurchase: rectToPurchase
    };
}
export function hidePurchaseDialog() {
    return {
        type: ActionTypes.HIDE_PURCHASE_DIALOG,
    };
}
export function changeZoom(direction) {
    return {
        type: ActionTypes.CHANGE_ZOOM,
        direction: direction
    };
}
//# sourceMappingURL=GridActions.js.map