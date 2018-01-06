import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import * as NavigationActions from '../actionCreators/NavigationActions';
import * as DataActions from '../actionCreators/DataActions';
import * as GridActions from '../actionCreators/GridActions';
import GridContainer from './GridContainer';
import PlotManagerContainer from './PlotManagerContainer';
import About from '../components/About';

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends Component {
  changeTab(tabIndex) {
    this.props.actions.changeTab(tabIndex);
  }

  componentDidMount() {
    this.props.actions.fetchPlotsFromWeb3(this.props.data.contractInfo);
  }

  render() {
    console.log(this.props);
    return (
      <div className="main-app-container">
        <Navbar collapseOnSelect className="navbar-static-top">
          <Navbar.Collapse>
            <Nav>
              <NavItem onClick={ () => { this.changeTab(0); } }>My Plots</NavItem>
              <NavItem onClick={ () => { this.changeTab(1); } }>
                <img src="../assets/logo.png" alt="ethGridLogo" height="21" width="21" />
              </NavItem>
              <NavItem onClick={ () => { this.changeTab(2); } }>About</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        { this.props.navigation.tabIndex === 0 ? <PlotManagerContainer actions={this.props.actions} {...this.props.data} /> : null }
        { this.props.navigation.tabIndex === 1 ? <GridContainer actions={this.props.actions} {...this.props.purchase} {...this.props.grid} {...this.props.data} /> : null }
        { this.props.navigation.tabIndex === 2 ? <About /> : null }
      </div>
    );
  }
}

App.propTypes = {
  navigation: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  grid: PropTypes.object.isRequired,
  purchase: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

/**
 * Global redux state.
 */
function mapStateToProps(state) {
  console.log(state);
  return {
    navigation: { tabIndex: state.navigation.tabIndex },
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
    actions: bindActionCreators(Object.assign({}, NavigationActions, DataActions, GridActions), dispatch)
  };
}

/**
 * 'connect' is provided to us by the bindings offered by 'react-redux'. It simply
 * connects a React component to a Redux store. It never modifies the component class
 * that is passed into it, it actually returns a new connected componet class for use.
 *
 * More info: https://github.com/rackt/react-redux
 */

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
