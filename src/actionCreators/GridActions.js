import * as ActionTypes from '../constants/ActionTypes';

export function hoverOverPlot(plotIndex) {
  return {
    type: ActionTypes.HOVER_OVER_PLOT,
    plotIndex
  };
}

export function enterBuyMode() {
  return {
    type: ActionTypes.ENTER_BUY_MODE
  }
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
  }
}
