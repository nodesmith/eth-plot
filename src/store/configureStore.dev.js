import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import DevTools from '../containers/DevTools';
import reducers from '../reducers/index';
/**
 * Entirely optional, this tiny library adds some functionality to
 * your DevTools, by logging actions/state to your console. Used in
 * conjunction with your standard DevTools monitor gives you great
 * flexibility!
 */
var finalCreateStore = compose(
// Middleware you want to use in development:
applyMiddleware(createLogger(), thunk), 
// Required! Enable Redux DevTools with the monitors you chose
DevTools.instrument())(createStore);
export function configureStore(initialState) {
    var store = finalCreateStore(rootReducer, initialState);
    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../reducers', function () {
            return store.replaceReducer(reducers);
        });
    }
    return store;
}
;
//# sourceMappingURL=configureStore.dev.js.map