import React, { Component, PropTypes } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';

import FullPageStatus from './FullPageStatus';
import PlotInfo from './PlotInfo';

import * as Enums from '../constants/Enums';

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
              { this.props.metamaskState === Enums.METAMASK_STATE.OPEN ?
                this.props.userPlots.length === 0 ? 
                  <FullPageStatus message="You don't have any owned plots. Visit the grid to purchase a plot." />
                  :
                  <div>
                    <h4>My Content</h4>
                    {plotInfos}
                    <hr />
                  </div>
                : null
              }        

              { this.props.metamaskState === Enums.METAMASK_STATE.UNINSTALLED ?
                <div id="metamaskLogoContainer">
                  <FullPageStatus message="You must have MetaMask intalled to use EthGrid.  Check it out here:" />
                  <a href={"https://metamask.io"} target="_blank"><img id="metamaskLogo" src={"../assets/metamasklogo.png"} /></a>
                </div>
                : null
              }

              { this.props.metamaskState === Enums.METAMASK_STATE.LOOCKED ?
                <div id="metamaskLogoContainer">
                  <FullPageStatus message="You must unlock MetaMask to proceed." />
                </div>
                : null
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
  metamaskState: React.PropTypes.number.isRequired
};

export default PlotManager;