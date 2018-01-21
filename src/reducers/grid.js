import * as ActionTypes from '../constants/ActionTypes';
const MAX_SCALE = 10;
const MIN_SCALE = 1;

const initialState = {
  hoveredIndex: -1,
  inBuyMode: false,
  isDraggingRect: false,
  dragRectStart: null,
  dragRectCurr: null,
  scale: 3
}

export default function grid(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.HOVER_OVER_PLOT:
    return Object.assign({}, state, { hoveredIndex: action.plotIndex });
  case ActionTypes.ENTER_BUY_MODE:
    return Object.assign({}, state, { inBuyMode: true });
  case ActionTypes.START_DRAGGING_RECT:
  {
    const dragRectStart = {
      x: action.x,
      y: action.y
    };

    const dragRectCurr = {
      x: action.x,
      y: action.y
    };

    return Object.assign({}, state, {isDraggingRect: true, dragRectStart, dragRectCurr});
  }
  case ActionTypes.RESIZE_DRAGGING_RECT:
  {
    if (!state.isDraggingRect) {
      return state;
    }

    const dragRectCurr = {
      x: action.x,
      y: action.y
    };
    
    return Object.assign({}, state, { dragRectCurr });
  }
  case ActionTypes.STOP_DRAGGING_RECT:
    return Object.assign({}, state, {isDraggingRect: false});
  case ActionTypes.CHANGE_ZOOM:
  {
    let newScale = state.scale;
    if (action.direction > 0) {
      newScale = Math.min(state.scale + 1, MAX_SCALE);
    } else {
      newScale = Math.max(state.scale - 1, MIN_SCALE);
    }

    return Object.assign({}, state, {scale: newScale});
  }
  default:
    return state;
  }
}
