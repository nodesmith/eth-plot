import * as ActionTypes from '../constants/ActionTypes';
import { MovementActions } from '../constants/Enums';

export function togglePurchaseFlow() {
  return {
    type: ActionTypes.TOGGLE_PURCHASE_FLOW
  };
}

export function purchaseImageSelected(imageFileInfo) {
  return {
    type: ActionTypes.PURCHASE_IMAGE_SELECTED,
    imageFileInfo
  }
}

export function transformRectToPurchase(delta) {
  return {
    type: ActionTypes.TRANSFORM_RECT_TO_PURCHASE,
    delta
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
