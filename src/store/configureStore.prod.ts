import { createStore, applyMiddleware, compose, Store, AnyAction } from 'redux';
import rootReducer, { RootState } from '../reducers';
import thunk from 'redux-thunk';

const finalCreateStore = compose(
  applyMiddleware(thunk)
)<RootState>(createStore) ;

export function configureStore(initialState: RootState): Store<RootState> {
  return finalCreateStore(rootReducer, initialState);  
}
