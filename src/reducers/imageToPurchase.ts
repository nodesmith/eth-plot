import { ActionTypes } from '../constants/ActionTypes';
import { Action } from '../actionCreators/EthGridAction';

export interface ImageFileInfo {
  w: number;
  h: number;
  fileName: string;
  fileData: string;
}

export interface ImageToPurchaseState {
  imageFileInfo?: ImageFileInfo
}

const initialState: ImageToPurchaseState = {
  imageFileInfo: undefined
};

export function imageToPurchaseReducer(state: ImageToPurchaseState = initialState, action: Action): ImageToPurchaseState {
  switch (action.type) {
    case ActionTypes.PURCHASE_IMAGE_SELECTED:
      return Object.assign({}, state, {
        imageFileInfo: action.imageFileInfo
      });
    default:
      return state;
  }
}
