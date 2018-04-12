import { ActionTypes } from '../constants/ActionTypes';
import { MovementActions, PurchaseStage } from '../constants/Enums';
import { purchasePlot as purchasePlotFromChain } from './DataActions';
import { Action } from './EthGridAction';
import { Point } from '../models';

export function togglePurchaseFlow(): Action {
  return {
    type: ActionTypes.TOGGLE_PURCHASE_FLOW
  };
}

export function purchaseImageSelected(imageFileInfo, plots): Action {
  return {
    type: ActionTypes.PURCHASE_IMAGE_SELECTED,
    imageFileInfo,
    plots
  }
}

export function transformRectToPurchase(delta, plots): Action {
  return {
    type: ActionTypes.TRANSFORM_RECT_TO_PURCHASE,
    delta,
    plots
  }
}

export function startTransformRectToPurchase(startLocation: Point, transformAction: MovementActions): Action {
  return {
    type: ActionTypes.START_TRANSFORM_RECT,
    startLocation,
    transformAction
  }
}

export function stopTransformRectToPurchase(): Action {
  return {
    type: ActionTypes.STOP_TRANSFORM_RECT
  }
}

export function completePurchaseStep(index: number, wasSkipped: boolean): Action {
  return {
    type: ActionTypes.COMPLETE_PURCHASE_STEP,
    index,
    wasSkipped
  };
}

export function goToPurchaseStep(index: number): Action {
  return {
    type: ActionTypes.GO_TO_PURCHASE_STEP,
    index
  };
}

export function changePlotWebsite(website: string, websiteValidation): Action {
  return {
    type: ActionTypes.CHANGE_PLOT_WEBSITE,
    website,
    websiteValidation
  };
}

export function changePlotBuyout(buyoutPriceInWei: string): Action {
  return {
    type: ActionTypes.CHANGE_PLOT_BUYOUT,
    buyoutPriceInWei
  };
}

export function changeBuyoutEnabled(isEnabled): Action {
  return {
    type: ActionTypes.CHANGE_BUYOUT_ENABLED,
    isEnabled
  };
}

// Thunk action for purchasing a plot. This requires uploading the image, submitting it to the chain, and waiting for transformations
export function completePlotPurchase(contractInfo, plots, rectToPurchase, imageData, website, initialBuyout) {
  return function (dispatch) {
    dispatch(startPurchasePlot());

    return dispatch(uploadImageData(uploadImageData)).then((ipfsHash) => {
      return dispatch(purchasePlotFromChain(contractInfo, plots, rectToPurchase, website, ipfsHash, changePurchaseStep));
    });
  };
}

export function cancelPlotPurchase(): Action {
  return {
    type: ActionTypes.CANCEL_PLOT_PURCHASE
  }
}

function startPurchasePlot(): Action {
  return {
    type: ActionTypes.START_PURCHASING_PLOT
  };
}

function uploadImageData(imageData) {
  return function(dispatch) {
    dispatch(changePurchaseStep(PurchaseStage.UPLOADING_TO_IPFS));

    // Here's were we do the post up to IPFS
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve('abc-123-xyz'), 500);
    }).then((ipfsHash) => {

      // Here's where we upload the image data to S3
      dispatch(changePurchaseStep(PurchaseStage.SAVING_TO_CLOUD));

      return new Promise((resolve2, reject2) => {
        setTimeout(() => resolve2(ipfsHash), 500);
      });
    })
  };
}

function changePurchaseStep(purchaseStage) {
  return {
    type: ActionTypes.CHANGE_PURCHASE_STAGE,
    purchaseStage
  }
}
