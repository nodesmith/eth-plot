import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as NavigationActions from '../actionCreators/NavigationActions';

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

  render() {
    console.log(this.props);
    return (
      <div className="main-app-container">
        <div className="main-app-nav">
          <button onClick={ () => { this.changeTab(0); } }>My Plots</button>
          <button onClick={ () => { this.changeTab(1); } }>Cool Logo</button>
          <button onClick={ () => { this.changeTab(2); } }>About</button>
        </div>

        { this.props.navigation.tabIndex === 0 ? <PlotManagerContainer /> : null }
        { this.props.navigation.tabIndex === 1 ? <GridContainer /> : null }
        { this.props.navigation.tabIndex === 2 ? <About /> : null }
      </div>
    );
  }
}

App.propTypes = {
  navigation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

/**
 * Global redux state.
 */
function mapStateToProps(state) {
  console.log(state);
  return {
    navigation: { tabIndex: state.navigation.tabIndex }
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
    actions: bindActionCreators(NavigationActions, dispatch)
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
