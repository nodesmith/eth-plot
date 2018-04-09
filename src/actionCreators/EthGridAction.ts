import { AnyAction } from 'redux';
import { ActionTypes } from '../constants/ActionTypes';

export interface Action extends AnyAction {
  type: ActionTypes;
}