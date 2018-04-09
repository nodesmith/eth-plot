import { ActionTypes } from '../constants/ActionTypes';
import { PurchaseStage } from '../constants/Enums';
import { purchasePlot as purchasePlotFromChain } from './DataActions';
export function togglePurchaseFlow() {
    return {
        type: ActionTypes.TOGGLE_PURCHASE_FLOW
    };
}
export function purchaseImageSelected(imageFileInfo, plots) {
    return {
        type: ActionTypes.PURCHASE_IMAGE_SELECTED,
        imageFileInfo: imageFileInfo,
        plots: plots
    };
}
export function transformRectToPurchase(delta, plots) {
    return {
        type: ActionTypes.TRANSFORM_RECT_TO_PURCHASE,
        delta: delta,
        plots: plots
    };
}
export function startTransformRectToPurchase(startLocation, transformAction) {
    return {
        type: ActionTypes.START_TRANSFORM_RECT,
        startLocation: startLocation,
        transformAction: transformAction
    };
}
export function stopTransformRectToPurchase() {
    return {
        type: ActionTypes.STOP_TRANSFORM_RECT
    };
}
export function completePurchaseStep(index, wasSkipped) {
    return {
        type: ActionTypes.COMPLETE_PURCHASE_STEP,
        index: index,
        wasSkipped: wasSkipped
    };
}
export function goToPurchaseStep(index) {
    return {
        type: ActionTypes.GO_TO_PURCHASE_STEP,
        index: index
    };
}
export function changePlotWebsite(website, websiteValidation) {
    return {
        type: ActionTypes.CHANGE_PLOT_WEBSITE,
        website: website,
        websiteValidation: websiteValidation
    };
}
export function changePlotBuyout(buyoutPriceInWei) {
    return {
        type: ActionTypes.CHANGE_PLOT_BUYOUT,
        buyoutPriceInWei: buyoutPriceInWei
    };
}
export function changeBuyoutEnabled(isEnabled) {
    return {
        type: ActionTypes.CHANGE_BUYOUT_ENABLED,
        isEnabled: isEnabled
    };
}
// Thunk action for purchasing a plot. This requires uploading the image, submitting it to the chain, and waiting for transformations
export function completePlotPurchase(contractInfo, plots, rectToPurchase, imageData, website, initialBuyout) {
    return function (dispatch) {
        dispatch(startPurchasePlot());
        return dispatch(uploadImageData(imageData)).then(function (ipfsHash) {
            return dispatch(purchasePlotFromChain(contractInfo, plots, rectToPurchase, website, ipfsHash, changePurchaseStep));
        });
    };
}
export function cancelPlotPurchase() {
    return {
        type: ActionTypes.CANCEL_PLOT_PURCHASE
    };
}
function startPurchasePlot() {
    return {
        type: ActionTypes.START_PURCHASING_PLOT
    };
}
function uploadImageData(imageData) {
    return function (dispatch) {
        dispatch(changePurchaseStep(PurchaseStage.UPLOADING_TO_IPFS));
        // Here's were we do the post up to IPFS
        return new Promise(function (resolve, reject) {
            setTimeout(function () { return resolve('abc-123-xyz'); }, 500);
        }).then(function (ipfsHash) {
            // Here's where we upload the image data to S3
            dispatch(changePurchaseStep(PurchaseStage.SAVING_TO_CLOUD));
            return new Promise(function (resolve2, reject2) {
                setTimeout(function () { return resolve2(ipfsHash); }, 500);
            });
        });
    };
}
function changePurchaseStep(purchaseStage) {
    return {
        type: ActionTypes.CHANGE_PURCHASE_STAGE,
        purchaseStage: purchaseStage
    };
}
//# sourceMappingURL=PurchaseActions.js.map