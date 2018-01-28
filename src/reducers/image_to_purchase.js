import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  imageFileInfo: null
};

export default function image_to_purchase(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.PURCHASE_IMAGE_SELECTED:
      return Object.assign({}, state, {
        imageFileInfo: action.imageFileInfo
      });
    default:
      return state;
  }
}
