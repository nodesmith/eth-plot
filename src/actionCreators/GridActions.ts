import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { Point, Rect } from '../models';

import { Action } from './EthGridAction';

export function hoverOverPlot(plotIndex: number): Action {
  return {
    type: ActionTypes.HOVER_OVER_PLOT,
    plotIndex
  };
}

export function enterBuyMode(): Action {
  return {
    type: ActionTypes.ENTER_BUY_MODE
  };
}

export function startDraggingRect(x: number, y: number): Action {
  return {
    type: ActionTypes.START_DRAGGING_RECT,
    x,
    y
  };
}

export function stopDraggingRect(): Action {
  return {
    type: ActionTypes.STOP_DRAGGING_RECT
  };
}

export function resizeDraggingRect(x: number, y: number): Action {
  return {
    type: ActionTypes.RESIZE_DRAGGING_RECT,
    x,
    y
  };
}

export function showPurchaseDialog(rectToPurchase: Rect): Action {
  return {
    type: ActionTypes.SHOW_PURCHASE_DIALOG,
    rectToPurchase
  };
}

export function hidePurchaseDialog(): Action {
  return {
    type: ActionTypes.HIDE_PURCHASE_DIALOG,
  };
}

export function changeZoom(direction: number): Action {
  return {
    type: ActionTypes.CHANGE_ZOOM,
    direction
  };
}


export function reportGridDragging(action: Enums.DragType, location: Point): Action {
  return {
    type: ActionTypes.REPORT_GRID_DRAG,
    action,
    location
  };
}
