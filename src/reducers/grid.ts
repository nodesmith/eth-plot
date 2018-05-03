import { Action } from '../actionCreators/EthGridAction';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { Point, Rect } from '../models';

const MAX_SCALE = 80;
const MIN_SCALE = .2;

export interface GridState {
  hoveredIndex: number;
  inBuyMode: boolean;
  isDraggingRect: boolean;
  dragRectStart?: Point;
  dragRectCurr?: Point;
  scale: number;
  centerPoint: Point;
  dragStart: Point | undefined;
}

const determineInitialScale = (): number => {
  const smallerDimension = Math.min(window.innerHeight, window.innerWidth);
  const initialPadding = 70;
  const targetSize = smallerDimension - (initialPadding * 2);
  return targetSize / 250; // 250 is the initial grid size
};

const initialState: GridState = {
  hoveredIndex: -1,
  inBuyMode: false,
  isDraggingRect: false,
  dragRectStart: undefined,
  dragRectCurr: undefined,
  scale: determineInitialScale(),
  centerPoint: {
    x: 125,
    y: 125
  },
  dragStart: undefined
};

export function gridReducer(state: GridState = initialState, action: Action): GridState {
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

        return Object.assign({}, state, { dragRectStart, dragRectCurr, isDraggingRect: true });
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
      return Object.assign({}, state, { isDraggingRect: false });
    case ActionTypes.CHANGE_ZOOM:
      {
        let newScale = state.scale;
        if (action.direction > 0) {
          newScale = Math.min(state.scale + action.direction, MAX_SCALE);
        } else {
          newScale = Math.max(state.scale + action.direction, MIN_SCALE);
        }

        return Object.assign({}, state, { scale: newScale });
      }
    case ActionTypes.REPORT_GRID_DRAG:
      {
        const location: Point = action.location;
        switch (action.action as Enums.DragType) {
          case Enums.DragType.START:
            return Object.assign({}, state, { dragStart: location });
          case Enums.DragType.MOVE: {
            const oldLocation = state.dragStart;
            if (oldLocation) {
              const delta = {
                x: (oldLocation.x - location.x) / state.scale, // Divide by scale to get the right info
                y: (oldLocation.y - location.y) / state.scale
              };

              if (delta.x !== 0 || delta.y !== 0) {
                const newDelta = {
                  x: state.centerPoint.x + delta.x,
                  y: state.centerPoint.y + delta.y
                };

                return Object.assign({}, state, { centerPoint: newDelta, dragStart: location });
              }
            }

            return state;
          }
          case Enums.DragType.STOP: {
            return Object.assign({}, state, { dragStart: undefined });
          }
        }
      }
    default:
      return state;
  }
}
