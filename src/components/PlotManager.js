import React, { Component, PropTypes } from 'react';

class PlotManager extends Component {
  render() {
    return (
      <div className="plotManagerSection">
        { this.props.userPlots.length === 0 ? 
          <div>
          <p>You don't have any owned plots.</p>
          <p>Visit the grid to purchase a plot.</p>
          </div>    
          : null
        }
      </div>
    );
  }
}

PlotManager.propTypes = {
  userPlots: React.PropTypes.arrayOf(React.PropTypes.shape({
    plotId: React.PropTypes.number.isRequired
  })).isRequired,
};

export default PlotManager;