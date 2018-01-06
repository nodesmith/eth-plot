import React, { Component, PropTypes } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import PlotInfo from './PlotInfo';

class PlotManager extends Component {
  render() {
    return (
      <div className="plot-section">
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8}>
            </Col>
          </Row>
        </Grid>
        {
          this.props.web3Initialized ?
          this.props.userPlots.length === 0 ? 
                <div className="plot-warning" >
                <h4><i>You don't have any owned plots. Visit the grid to purchase a plot.</i></h4>
                </div>    
                :
                <PlotInfo />
          :              
          <div className="plot-warning" >
          <h4><i>Please connect to EthGrid with Metamask or similar wallet.</i></h4>
          </div>  
        }
      </div>
    );
  }
}

PlotManager.propTypes = {
  userPlots: React.PropTypes.arrayOf(React.PropTypes.shape({
    plotId: React.PropTypes.number.isRequired,
    web3Initialized: React.PropTypes.bool.isRequired
  })).isRequired,
};

export default PlotManager;