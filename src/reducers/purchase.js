import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  purchaseDialogVisible: false,
  rectToPurchase: {},
  initialRectToPurchase: {},
  initialRectToPurchaseDeltas: [],
  currentTransform: null,
  purchaseFlowOpen: false,
  purchasePriceInWei: '438782',
  activeStep: 0,
  completedSteps: {},
  imageName: '',
  imageDimensions: {w: -1, h:-1},
  website: '',
  buyoutPriceInWei: '328742394234',
  buyoutEnabled: true
};

function determineInitialRect(imageFileInfo) {
  const ratio = imageFileInfo.w / imageFileInfo.h;
  const targetDimension = 30;
  let w = 30, h = 30;
  if (imageFileInfo.w > imageFileInfo.h) {
    h = Math.round((30 / imageFileInfo.w) * imageFileInfo.h);
  } else {
    w = Math.round((30 / imageFileInfo.h) * imageFileInfo.w);
  }
  
  return {
    x: 100,
    y: 100,
    w: w,
    h: h,
    x2: 100 + w,
    y2: 100 + h
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
        rectToPurchase: determineInitialRect(action.imageFileInfo),
        initialRectToPurchase: determineInitialRect(action.imageFileInfo),
        initialRectToPurchaseDeltas: [],
        currentTransform: null,
        imageName: action.imageFileInfo.fileName
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
    case ActionTypes.COMPLETE_PURCHASE_STEP:
      const nextStep = action.index + 1;
      const completedSteps = Object.assign({}, state.completedSteps, { [action.index]: true} );
      return Object.assign({}, state, {
        completedSteps: completedSteps,
        activeStep: nextStep
      });
    case ActionTypes.GO_TO_PURCHASE_STEP:
      return Object.assign({}, state, {
        activeStep: action.index
      });
    case ActionTypes.CHANGE_PLOT_WEBSITE:
      return Object.assign({}, state, {
        website: action.website
      });
    case ActionTypes.CHANGE_PLOT_BUYOUT:
      return Object.assign({}, state, {
        buyoutPriceInWei: action.buyoutPriceInWei
      });
    case ActionTypes.CHANGE_BUYOUT_ENABLED:
      return Object.assign({}, state, {
        buyoutEnabled: action.isEnabled
      });
    default:
      return state;
  }
}
