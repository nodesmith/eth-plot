/**
 * Based on the current environment variable, we need to make sure
 * to exclude any DevTools-related code from the production builds.
 * The code is envify'd - using 'DefinePlugin' in Webpack.
 */

import { configureStore as devConfig } from './configureStore.dev';
import { configureStore as prodConfig } from './configureStore.prod';
import { Store } from 'redux';
import { RootState } from '../reducers';

let loadedStore: (initialState?: RootState) => Store<{}>;

if (process.env.NODE_ENV === 'production') {
  loadedStore = prodConfig;
} else {
  loadedStore = devConfig;
}

export const configureStore = loadedStore;
