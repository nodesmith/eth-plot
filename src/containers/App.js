import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Reboot from 'material-ui/Reboot';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as AccountActions from '../actionCreators/AccountActions';
import * as DataActions from '../actionCreators/DataActions';
import * as GridActions from '../actionCreators/GridActions';
import * as PurchaseActions from '../actionCreators/PurchaseActions';
import * as Enums from '../constants/Enums';
import GridContainer from './GridContainer';
import MainContainer from './MainContainer';
import PlotManagerContainer from './PlotManagerContainer';
import PurchaseFlowContainer from './PurchaseFlowContainer';
import About from '../components/About';

const Web3 = require('web3');

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends Component {
  componentDidMount() {
    this.props.actions.fetchPlotsFromWeb3(this.props.data.contractInfo);

    /**
     * The following timer is the MetaMask recommended way of checking for 
     * changes to MetaMask.  There are three possible states:
     *  1) A user doesn't have MetaMask installed.
     *  2) A user's MetaMask account is locked, they need to under a password to unlock.
     *  3) A user's account is open and ready for use.
     * 
     * More info available here: 
     * https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md
     */
    this.accountInterval = setInterval(function() {
      if (typeof window.web3 !== 'undefined') {
        let newWeb3 = new Web3(window.web3.currentProvider);
        newWeb3.eth.getAccounts().then(accounts => {
          if (accounts.length > 0) {
            this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.OPEN);
          } else {
            this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.LOCKED);
          };
        });
      } else {
        this.props.actions.updateMetamaskState(Enums.METAMASK_STATE.UNINSTALLED);
      }
    }.bind(this), 1000000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="main-app-container">
        <Reboot />
        <AppBar position="static" color="primary">
          <Toolbar>
            <Button component={NavLink} to="/" color="inherit">
              <Typography type="title" color="inherit">
                Eth Grid
              </Typography>
            </Button>
            <Button component={NavLink} to="/myplots" color="inherit">My Plots</Button>
            <Button component={NavLink} to="/about" color="inherit">About</Button>
          </Toolbar>
        </AppBar>
        <main>
          <Switch>
            <Route exact path='/' render={(routeProps) => (
              <MainContainer {...routeProps} actions={this.props.actions} purchase={this.props.purchase} {...this.props.grid} {...this.props.data} />
            )}/>
            <Route path='/myplots' render={(routeProps) => (
              <PlotManagerContainer {...routeProps} actions={this.props.actions} {...this.props.data} {...this.props.account} />
            )}/>
            <Route path='/about' component={About}/>
          </Switch>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  account: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  grid: PropTypes.object.isRequired,
  purchase: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

/**
 * Global redux state.
 */
function mapStateToProps(state) {
  // console.log(state);
  return {
    account: state.account,
    data: state.data,
    grid: state.grid,
    purchase: state.purchase
  };
}

/**
 * Turns an object whose values are 'action creators' into an object with the same
 * keys but with every action creator wrapped into a 'dispatch' call that we can invoke
 * directly later on. Here we imported the actions specified in 'CounterActions.js' and
 * used the bindActionCreators function Redux provides us.
 *
 * More info: http://redux.js.org/docs/api/bindActionCreators.html
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, AccountActions, DataActions, GridActions, PurchaseActions), dispatch)
  };
}

/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 * 
 * The withRouter wrapper ensures routes are properly updated.  More info here: 
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/redux.md
 */
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));