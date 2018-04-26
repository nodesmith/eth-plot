import { applyMiddleware, compose, createStore, AnyAction, Store } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers, { RootState } from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk)
)<RootState>(createStore) ;

export function configureStore(initialState: RootState): Store<RootState> {
  return finalCreateStore(rootReducer, initialState);  
}
