import { CHANGE_TAB } from '../constants/ActionTypes';

export function changeTab(newIndex) {
  return {
    type: CHANGE_TAB,
    newIndex
  };
}