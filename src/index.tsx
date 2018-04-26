import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#607D8B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    error: {
      main: '#ef5350',
      contrastText: '#000000',
    }
  },
});

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import Root from './containers/Root';
import { configureStore } from './store/configureStore';

const store = configureStore();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Root store={store} />
  </MuiThemeProvider>,
  document.body.appendChild(document.createElement('div'))
);
