import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  hoveredIndex: -1
}

export default function grid(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.HOVER_OVER_PLOT:
    return Object.assign({}, state, { hoveredIndex: action.plotIndex });
  default:
    return state;
  }
}
