import { ActionTypes } from '../constants/ActionTypes';
import { computePurchaseInfo } from '../data/ComputePurchaseInfo';
import { createEmptyRect } from '../models';
function determineInitialRect(imageFileInfo) {
    var ratio = imageFileInfo.w / imageFileInfo.h;
    var targetDimension = 30;
    var w = 30, h = 30;
    if (imageFileInfo.w > imageFileInfo.h) {
        h = Math.round((30 / imageFileInfo.w) * imageFileInfo.h);
    }
    else {
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
    var top = delta.top, left = delta.left, bottom = delta.bottom, right = delta.right;
    var result = {
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
    return (a.left == b.left &&
        a.bottom == b.bottom &&
        a.right == b.right &&
        a.top == b.top);
}
var initialState = {
    purchaseDialogVisible: false,
    rectToPurchase: createEmptyRect(),
    initialRectToPurchase: undefined,
    initialRectToPurchaseDeltas: [],
    currentTransform: undefined,
    purchaseFlowOpen: false,
    purchasePriceInWei: '',
    activeStep: 0,
    completedSteps: {},
    imageName: '',
    imageDimensions: { w: -1, h: -1 },
    website: '',
    buyoutPriceInWei: '328742394234',
    buyoutEnabled: true,
};
export function purchaseReducer(state, action) {
    if (state === void 0) { state = initialState; }
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
                var initialRect = determineInitialRect(action.imageFileInfo);
                var purchaseInfo = computePurchaseInfo(initialRect, action.plots);
                return Object.assign({}, state, {
                    rectToPurchase: initialRect,
                    initialRectToPurchase: initialRect,
                    initialRectToPurchaseDeltas: [],
                    currentTransform: null,
                    imageName: action.imageFileInfo.fileName,
                    purchasePriceInWei: purchaseInfo.purchasePrice
                });
            }
        case ActionTypes.START_TRANSFORM_RECT:
            var result = Object.assign({}, state, {
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
        case ActionTypes.TRANSFORM_RECT_TO_PURCHASE:
            {
                var previousDeltaIndex = state.initialRectToPurchaseDeltas.length - 1;
                var previousDelta = state.initialRectToPurchaseDeltas[previousDeltaIndex];
                if (deltasEqual(action.delta, previousDelta)) {
                    console.log('deltas equal');
                    return state;
                }
                // Clone the array
                var rectDeltas = state.initialRectToPurchaseDeltas.slice(0);
                rectDeltas[previousDeltaIndex] = action.delta;
                // Apply all the deltas to get our new rect
                var rectToPurchase = rectDeltas.reduce(function (rect, delta) { return addDelta(rect, delta); }, state.initialRectToPurchase);
                // Recompute how much this will cost
                var purchaseInfo = computePurchaseInfo(rectToPurchase, action.plots);
                return Object.assign({}, state, {
                    rectToPurchase: rectToPurchase,
                    initialRectToPurchaseDeltas: rectDeltas,
                    purchasePriceInWei: purchaseInfo.purchasePrice
                });
            }
        case ActionTypes.COMPLETE_PURCHASE_STEP:
            var nextStep = action.index + 1;
            var completedSteps = Object.assign({}, state.completedSteps, (_a = {}, _a[action.index] = true, _a));
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
    var _a;
}
//# sourceMappingURL=purchase.js.map