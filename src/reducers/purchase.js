import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  purchaseDialogVisible: false,
  rectToPurchase: {},
  initialRectToPurchase: {},
  initialRectToPurchaseDeltas: [],
  currentTransform: null,
  purchaseFlowOpen: false,
  imageToPurchase: null
};

function determineInitialRect(imageFileInfo) {
  return {
    x: 100,
    y: 100,
    w: 30,
    h: 30,
    x2: 130,
    y2: 130
  };
}

function addDelta(rect, delta) {
  const { top, left, bottom, right } = delta;

  let result = {
    x: rect.x + left,
    x2: rect.x2 + right,
    y: rect.y + top,
    y2: rect.y2 + bottom,
  };

  result.w = result.x2 - result.x;
  result.h = result.y2 - result.y;

  return result;
}

function deltasEqual(a, b) {
  return (
    a.left == b.left &&
    a.bottom == b.bottom &&
    a.right == b.right &&
    a.top == b.top );
}

export default function purchase(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SHOW_PURCHASE_DIALOG:
      return Object.assign({}, state, {
        purchaseDialogVisible: true,
        rectToPurchase: action.rectToPurchase
      });
    case ActionTypes.HIDE_PURCHASE_DIALOG:
      return Object.assign({}, state, {
        purchaseDialogVisible: false
      });
    case ActionTypes.TOGGLE_PURCHASE_FLOW:
      return Object.assign({}, state, {
        purchaseFlowOpen: !state.purchaseFlowOpen
      });
    case ActionTypes.PURCHASE_IMAGE_SELECTED:
      return Object.assign({}, state, {
        imageToPurchase: action.imageFileInfo,
        rectToPurchase: determineInitialRect(action.imageFileInfo),
        initialRectToPurchase: determineInitialRect(action.imageFileInfo)
      });
    case ActionTypes.START_TRANSFORM_RECT:
      let result = Object.assign({}, state, {
        currentTransform: {
          startLocation: action.startLocation,
          transformAction: action.transformAction
        }
      });
      result.initialRectToPurchaseDeltas.push({top: 0, left: 0, bottom: 0, right: 0});
      return result;
    case ActionTypes.STOP_TRANSFORM_RECT:
      return Object.assign({}, state, {
        currentTransform: null
      });
    case ActionTypes.TRANSFORM_RECT_TO_PURCHASE:
      const previousDeltaIndex = state.initialRectToPurchaseDeltas.length - 1;
      let previousDelta = state.initialRectToPurchaseDeltas[previousDeltaIndex];
      if (deltasEqual(action.delta, previousDelta)) {
        console.log('deltas equal');
        return state;
      }

      // Clone the array
      const rectDeltas = state.initialRectToPurchaseDeltas.slice(0);
      rectDeltas[previousDeltaIndex] = action.delta;

      // Apply all the deltas to get our new rect
      const rectToPurchase = rectDeltas.reduce((rect, delta) => addDelta(rect, delta), state.initialRectToPurchase);

      return Object.assign({}, state, {
        rectToPurchase: rectToPurchase,
        initialRectToPurchaseDeltas: rectDeltas
      });
    default:
      return state;
  }
}
