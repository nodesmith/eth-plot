import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PlotManager from '../components/PlotManager';

class PlotManagerContainer extends Component {
  render() {
    let userPlots = this.props.plots ? this.props.plots.filter((plot) => {
      if (plot.owner === this.props.activeAccount) {
        return plot;
      }
    }) : [];

    return (
      <PlotManager 
        userPlots={userPlots} 
        metamaskState={this.props.metamaskState}
        actions={this.props.actions}
        contractInfo={this.props.contractInfo}
      />
    );
  }
}

PlotManagerContainer.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  contractInfo: PropTypes.object.isRequired,
  activeAccount: PropTypes.string.isRequired
};

export default PlotManagerContainer;