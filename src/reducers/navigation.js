import { CHANGE_TAB } from '../constants/ActionTypes';

const initialState = {
  tabIndex: 1
}

export default function navigation(state = initialState, action) {
  switch (action.type) {
  case CHANGE_TAB:
    return { tabIndex: action.newIndex }
  default:
    return state;
  }
}
