import CssBaseline from 'material-ui/CssBaseline';
import * as React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { Store } from 'redux';

import App from './App';

/**
 * Component is exported for conditional usage in Root.js
 */
class Root extends React.Component<{store: Store<{}> }> {
  render() {
    const { store } = this.props;
    return (
      /**
       * Provider is a component provided to us by the 'react-redux' bindings that
       * wraps our app - thus making the Redux store/state available to our 'connect()'
       * calls in component hierarchy below.
       */
      <Provider store={store}>
        <div>
          <CssBaseline />
          <HashRouter>
            <App />
          </HashRouter>
        </div>
      </Provider>
    );
  }
}

export default Root;
