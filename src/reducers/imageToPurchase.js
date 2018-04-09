import { ActionTypes } from '../constants/ActionTypes';
var initialState = {
    imageFileInfo: undefined
};
export function imageToPurchaseReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case ActionTypes.PURCHASE_IMAGE_SELECTED:
            return Object.assign({}, state, {
                imageFileInfo: action.imageFileInfo
            });
        default:
            return state;
    }
}
//# sourceMappingURL=imageToPurchase.js.map