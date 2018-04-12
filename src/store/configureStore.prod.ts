import { createStore, applyMiddleware, compose, Store } from 'redux';
import rootReducer, { RootState } from '../reducers';
import thunk from 'redux-thunk';

const finalCreateStore = compose(
  applyMiddleware(thunk)
)(createStore);

export function configureStore(initialState: RootState) {
  return finalCreateStore(rootReducer, initialState);
}
