import * as ActionTypes from '../constants/ActionTypes';

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
