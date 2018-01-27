import * as ActionTypes from '../constants/ActionTypes';
import { MovementActions } from '../constants/Enums';

export function togglePurchaseFlow() {
  return {
    type: ActionTypes.TOGGLE_PURCHASE_FLOW
  };
}

export function purchaseImageSelected(imageFileInfo, plots) {
  return {
    type: ActionTypes.PURCHASE_IMAGE_SELECTED,
    imageFileInfo,
    plots
  }
}

export function transformRectToPurchase(delta, plots) {
  return {
    type: ActionTypes.TRANSFORM_RECT_TO_PURCHASE,
    delta,
    plots
  }
}

export function startTransformRectToPurchase(startLocation, transformAction) {
  return {
    type: ActionTypes.START_TRANSFORM_RECT,
    startLocation,
    transformAction
  }
}

export function stopTransformRectToPurchase() {
  return {
    type: ActionTypes.STOP_TRANSFORM_RECT
  }
}

export function completePurchaseStep(index, wasSkipped) {
  return {
    type: ActionTypes.COMPLETE_PURCHASE_STEP,
    index,
    wasSkipped
  };
}

export function goToPurchaseStep(index) {
  return {
    type: ActionTypes.GO_TO_PURCHASE_STEP,
    index
  };
}

export function changePlotWebsite(website, websiteValidation) {
  return {
    type: ActionTypes.CHANGE_PLOT_WEBSITE,
    website,
    websiteValidation
  };
}

export function changePlotBuyout(buyoutPriceInWei) {
  return {
    type: ActionTypes.CHANGE_PLOT_BUYOUT,
    buyoutPriceInWei
  };
}

export function changeBuyoutEnabled(isEnabled) {
  return {
    type: ActionTypes.CHANGE_BUYOUT_ENABLED,
    isEnabled
  };
}

// Thunk action for purchasing a plot. This requires uploading the image, submitting it to the chain, and waiting for transformations
export function purchasePlot(contractInfo, plots, rectToPurchase, imageData, website, initialBuyout) {
  debugger;
  return function (dispatch) {

    dispatch(startPurchasePlot());
  };
}

function startPurchasePlot() {
  return {
    type: ActionTypes.START_PURCHASING_PLOT
  };
}
