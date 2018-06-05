import { BigNumber } from 'bignumber.js';

import { Action } from '../actionCreators/EthPlotAction';
import { ActionTypes } from '../constants/ActionTypes';
import * as Enums from '../constants/Enums';
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';
import { createEmptyRect, ImageFileInfo, InputValidation, Point, Rect, RectDelta, RectTransform } from '../models';

function determineInitialRect(imageFileInfo: ImageFileInfo, scale: number, centerPoint: Point) {
  const targetDimension = Math.round(Math.min(30, 100 / scale));
  let w = targetDimension;
  let h = targetDimension;
  if (imageFileInfo.w > imageFileInfo.h) {
    h = Math.round((targetDimension / imageFileInfo.w) * imageFileInfo.h);
  } else {
    w = Math.round((targetDimension / imageFileInfo.h) * imageFileInfo.w);
  }

  let x = Math.max(0, Math.round(centerPoint.x - (w / 2)));
  let y = Math.max(0, Math.round(centerPoint.y - (h / 2)));
  let x2 = x + w;
  let y2 = y + h;

  if (x2 > 250) {
    x2 = 250;
    x = 250 - w;
  }

  if (y2 > 250) {
    y2 = 250;
    y = 250 - h;
  }
  
  return { x, y, x2, y2, w, h };
}

function addDelta(rect: Rect, delta: RectDelta): Rect {
  const { top, left, bottom, right } = delta;

  const result = {
    x: rect.x + left,
    x2: rect.x2 + right,
    y: rect.y + top,
    y2: rect.y2 + bottom,
    w: 0,
    h: 0
  };

  result.w = result.x2 - result.x;
  result.h = result.y2 - result.y;

  return result;
}

function deltasEqual(a, b) {
  return (
    a.left === b.left &&
    a.bottom === b.bottom &&
    a.right === b.right &&
    a.top === b.top);
}


const allowedFileTypes = [
  'image/jpeg',
  'image/jpeg',
  'image/png',
  'image/svg+xml'
];


export interface PurchaseState {
  purchaseDialogVisible: boolean;
  rectToPurchase?: Rect;
  initialRectToPurchase?: Rect;
  initialRectToPurchaseDeltas: RectDelta[];
  currentTransform?: RectTransform;
  purchaseFlowOpen: boolean;
  purchasePriceInWei: string;
  activeStep: number;
  completedSteps: {[index: number]: boolean};
  imageFileInfo?: ImageFileInfo;
  imageDimensions: {w: number, h:number };
  website: string;
  buyoutPricePerPixelInWei?: string;
  buyoutEnabled: boolean;
  allowedFileTypes: string[];
  imageValidation: InputValidation;
  showHeatmap: boolean;
  showGrid : boolean;
  snackbarMessage: string;
}

const initialState: PurchaseState = {
  purchaseDialogVisible: false,
  rectToPurchase: createEmptyRect(),
  initialRectToPurchase: undefined,
  initialRectToPurchaseDeltas: [],
  currentTransform: undefined,
  purchaseFlowOpen: false,
  purchasePriceInWei: '',
  activeStep: 0,
  completedSteps: {},
  imageFileInfo: undefined,
  imageDimensions: { w: -1, h:-1 },
  website: '',
  buyoutPricePerPixelInWei: undefined,
  buyoutEnabled: true,
  allowedFileTypes,
  imageValidation: validateImageFile(),
  showHeatmap: true,
  showGrid: true,
  snackbarMessage: ''
};


function validateImageFile(imageFileInfo?: ImageFileInfo): InputValidation {
  if (!imageFileInfo) {
    return {
      state: Enums.InputValidationState.UNKNOWN,
      message: 'This is the file which will be in your plot'
    };
  }

  if (allowedFileTypes.indexOf(imageFileInfo.fileType) < 0) {
    // Not allowed file
    return {
      state: Enums.InputValidationState.ERROR,
      message: 'File must be an image type'
    };
  }

  if (imageFileInfo.fileSize > 3000000) {
    const fileSizeInMb = imageFileInfo.fileSize / 1000000;
    return {
      state: Enums.InputValidationState.ERROR,
      message: `File must be less than 3MB (file is ${fileSizeInMb}MB)`
    };
  }

  return {
    state: Enums.InputValidationState.SUCCESS,
    message: 'The image looks great!'
  };
}

function completePurchaseStep(state: PurchaseState, index: number): PurchaseState {
  const nextStep = index + 1;

  let suggestedBuyoutPerPixel = state.buyoutPricePerPixelInWei;
  if (!suggestedBuyoutPerPixel && nextStep === 2) {
    if (!state.rectToPurchase) {
      throw 'Expected purchase rectangle to be defined at this stage';
    }

    const rectArea = state.rectToPurchase.w * state.rectToPurchase.h;

    // We just completed the position/size step, and a buyout has neer been set,
    // so now we can set a buyout price suggestion (x2 purchase price)
    suggestedBuyoutPerPixel = new BigNumber(state.purchasePriceInWei).div(rectArea).mul(2).toString();
  }

  const completedSteps = Object.assign({}, state.completedSteps, { [index]: true });
  return Object.assign({}, state, {
    completedSteps,
    activeStep: nextStep,
    buyoutPricePerPixelInWei: suggestedBuyoutPerPixel
  });
}


export function purchaseReducer(state: PurchaseState = initialState, action: Action): PurchaseState {
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
      {
        const imageValidation = validateImageFile(action.imageFileInfo);

        const initialRect = determineInitialRect(action.imageFileInfo, action.scale, action.centerPoint);
        const purchaseInfo = computePurchaseInfo(initialRect, action.plots);
        const nextState = Object.assign({}, state, {
          imageValidation,
          rectToPurchase: initialRect,
          initialRectToPurchase: initialRect,
          initialRectToPurchaseDeltas: [],
          currentTransform: null,
          imageFileInfo: action.imageFileInfo,
          purchasePriceInWei: purchaseInfo.isValid ? purchaseInfo.purchaseData!.purchasePrice : '0',
          snackbarMessage: purchaseInfo.isValid ? '' : purchaseInfo.errorMessage
        });

        if (imageValidation.state === Enums.InputValidationState.SUCCESS) {
          return completePurchaseStep(nextState, 0);
        } else {
          return nextState;
        }
      }
    case ActionTypes.START_TRANSFORM_RECT:
      const result = Object.assign({}, state, {
        currentTransform: {
          startLocation: action.startLocation,
          transformAction: action.transformAction
        }
      });
      result.initialRectToPurchaseDeltas.push({ top: 0, left: 0, bottom: 0, right: 0 });
      return result;
    case ActionTypes.STOP_TRANSFORM_RECT:
      return Object.assign({}, state, {
        currentTransform: null
      });
    case ActionTypes.TRANSFORM_RECT_TO_PURCHASE: {
      const previousDeltaIndex = state.initialRectToPurchaseDeltas.length - 1;
      const previousDelta = state.initialRectToPurchaseDeltas[previousDeltaIndex];
      if (deltasEqual(action.delta, previousDelta)) {
        return state;
      }

      // Clone the array
      const rectDeltas = state.initialRectToPurchaseDeltas.slice(0);
      rectDeltas[previousDeltaIndex] = action.delta;

      // Apply all the deltas to get our new rect
      const rectToPurchase = rectDeltas.reduce((rect, delta) => addDelta(rect, delta), state.initialRectToPurchase!);
      if (rectToPurchase.x < 0 || rectToPurchase.y < 0 || rectToPurchase.x2 > 250 || rectToPurchase.y2 > 250 || rectToPurchase.w < 1 || rectToPurchase.h < 1) {
        return state;
      }

      // Recompute how much this will cost
      const purchaseInfo = computePurchaseInfo(rectToPurchase, action.plots);

      return Object.assign({}, state, {
        rectToPurchase,
        initialRectToPurchaseDeltas: rectDeltas,
        purchasePriceInWei: purchaseInfo.isValid ? purchaseInfo.purchaseData!.purchasePrice : '0',
        snackbarMessage: purchaseInfo.isValid ? '' : purchaseInfo.errorMessage
      });
    }
    case ActionTypes.COMPLETE_PURCHASE_STEP:
      return completePurchaseStep(state, action.index);
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
        buyoutPricePerPixelInWei: action.buyoutPricePerPixelInWei
      });
    case ActionTypes.CHANGE_BUYOUT_ENABLED:
      return Object.assign({}, state, {
        buyoutEnabled: action.isEnabled
      });
    case ActionTypes.TOGGLE_SHOW_HEATMAP:
      return Object.assign({}, state, {
        showHeatmap: action.show
      });
    case ActionTypes.TOGGLE_SHOW_GRID:
      return Object.assign({}, state, {
        showGrid: action.show
      });
    case ActionTypes.RESET_PURCHASE_FLOW: {
      return initialState;
    }
    case ActionTypes.SHOW_SNACKBAR_MESSAGE: {
      return Object.assign({}, state, { snackbarMessage: action.message });
    }
    default:
      return state;
  }
}
