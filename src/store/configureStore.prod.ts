import { applyMiddleware, compose, createStore, AnyAction, Store } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers, { RootState } from '../reducers';
import index from '../reducers/index';

const finalCreateStore = compose(
  applyMiddleware(reduxThunk)
)<RootState>(createStore) ;

export function configureStore(initialState: RootState): Store<RootState> {
  return finalCreateStore(index, initialState);  
}
