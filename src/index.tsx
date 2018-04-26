import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#a7c0cd',
      main: '#78909c',
      dark: '#4b636e',
      contrastText: '#000000',
    },
    secondary: {
      light: '#e6ffff',
      main: '#f44336',
      dark: '#82b3c9',
      contrastText: '#000',
    }
  },
});

/**
 * Both configureStore and Root are required conditionally.
 * See configureStore.js and Root.js for more details.
 */
import { configureStore } from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Root store={store} />
  </MuiThemeProvider>,
  document.body.appendChild(document.createElement('div'))
);
