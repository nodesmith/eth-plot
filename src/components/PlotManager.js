import React, { Component, PropTypes } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

class PlotManager extends Component {
  render() {
    return (
      <div className="plotManagerSection">
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8}>
            </Col>
          </Row>
        </Grid>

        <div className="noPlotWarning" >
          { this.props.userPlots.length === 0 ? 
                  <div>
                  <p>You don't have any owned plots.</p>
                  <p>Visit the grid to purchase a plot.</p>
                  </div>    
                  : null
          }
        </div>
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