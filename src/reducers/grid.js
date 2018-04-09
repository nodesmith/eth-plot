import { ActionTypes } from '../constants/ActionTypes';
var MAX_SCALE = 10;
var MIN_SCALE = 1;
var initialState = {
    hoveredIndex: -1,
    inBuyMode: false,
    isDraggingRect: false,
    dragRectStart: undefined,
    dragRectCurr: undefined,
    scale: 3
};
export function gridReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ActionTypes.HOVER_OVER_PLOT:
            return Object.assign({}, state, { hoveredIndex: action.plotIndex });
        case ActionTypes.ENTER_BUY_MODE:
            return Object.assign({}, state, { inBuyMode: true });
        case ActionTypes.START_DRAGGING_RECT:
            {
                var dragRectStart = {
                    x: action.x,
                    y: action.y
                };
                var dragRectCurr = {
                    x: action.x,
                    y: action.y
                };
                return Object.assign({}, state, { isDraggingRect: true, dragRectStart: dragRectStart, dragRectCurr: dragRectCurr });
            }
        case ActionTypes.RESIZE_DRAGGING_RECT:
            {
                if (!state.isDraggingRect) {
                    return state;
                }
                var dragRectCurr = {
                    x: action.x,
                    y: action.y
                };
                return Object.assign({}, state, { dragRectCurr: dragRectCurr });
            }
        case ActionTypes.STOP_DRAGGING_RECT:
            return Object.assign({}, state, { isDraggingRect: false });
        case ActionTypes.CHANGE_ZOOM:
            {
                var newScale = state.scale;
                if (action.direction > 0) {
                    newScale = Math.min(state.scale + 1, MAX_SCALE);
                }
                else {
                    newScale = Math.max(state.scale - 1, MIN_SCALE);
                }
                return Object.assign({}, state, { scale: newScale });
            }
        default:
            return state;
    }
}
//# sourceMappingURL=grid.js.map