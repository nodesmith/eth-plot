import { applyMiddleware, compose, createStore, Store, StoreEnhancerStoreCreator } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';

import DevTools from '../containers/DevTools';
import reducers, { RootState } from '../reducers';
import index from '../reducers/index';

/**
 * Entirely optional, this tiny library adds some functionality to
 * your DevTools, by logging actions/state to your console. Used in
 * conjunction with your standard DevTools monitor gives you great
 * flexibility!
 */

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(createLogger(), thunk)  as (next: StoreEnhancerStoreCreator<RootState>) => StoreEnhancerStoreCreator<RootState>,
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
)(createStore);

export function configureStore(initialState): Store<RootState> {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(reducers)
    );
  }

  return store;
}
