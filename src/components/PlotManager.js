import React, { Component, PropTypes } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

class PlotManager extends Component {
  render() {
    const plotInfos = this.props.userPlots.map((plot, index) => {
      return (<PlotInfo info={plot} key={index} actions={this.props.actions} contractInfo={this.props.contractInfo} />);
    });
    
    return (
      <div className="plot-section">
        <Grid>
          <Row className="show-grid">
            <Col xs={2} />
            <Col xs={8}>
              {this.props.web3Initialized ?
                this.props.userPlots.length === 0 ? 
                  <FullPageStatus message="You don't have any owned plots. Visit the grid to purchase a plot." />
                  :
                  <div>
                    <h4>My Content</h4>
                    {plotInfos}
                    <hr />
                  </div>
                :              
              <FullPageStatus message="Please connect to EthGrid with Metamask or similar wallet" />
              }
            </Col>
            <Col xs={2} />
          </Row>
        </Grid>
        {

        }
      </div>
    );
  }
}

PlotManager.propTypes = {
  userPlots: React.PropTypes.array.isRequired,
  web3Initialized: React.PropTypes.bool.isRequired
};

export default PlotManager;