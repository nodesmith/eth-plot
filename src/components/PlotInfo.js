import React, { Component } from 'react';
import { 
  Button, 
  Col,
  Collapse,
  Input,
  Row,
  Well
} from 'react-bootstrap';

import Buyout from './Buyout';

class PlotInfo extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  render() {
    const previewStyle = {
      backgroundColor: this.props.info.color,
      width: `${this.props.info.rect.w}px`,
      height: `${this.props.info.rect.h}px`,
    };

    return (
      <div className="plot-info">
        <hr />
        <Row className="show-grid">     
          <Col xs={6}>
            <h4>Plot url: <a href={this.props.info.data.url}>{this.props.info.data.url}</a></h4>
            
            { 
              this.props.info.txHash ?
              <h4>Trasaction in progress: <a href={`https://etherscan.io/address/${this.props.info.txHash}`}>{this.props.info.txHash}</a></h4>
              : null
            }

            <h4>Buyout price per pixel in gwei: {
              (this.props.info.buyoutPrice > 0) ? this.props.info.buyoutPrice : "Not For Sale" }
            </h4>

          
            <h4>Unsold pixels in plot: {
              // TODO Account for holes.
              this.props.info.rect.w * this.props.info.rect.h
            }</h4>

            <Button onClick={() => this.setState({ open: !this.state.open })}>
              <span className="glyphicon glyphicon-pencil"></span>
            </Button>
            <Collapse in={this.state.open}>
              <Well>
              <Buyout 
                actions={this.props.actions} 
                contractInfo={this.props.contractInfo}
                currentBuyout={this.props.info.buyoutPrice} 
                totalPixels={this.props.info.rect.w * this.props.info.rect.h}
                zoneIndex={this.props.info.zoneIndex}
              />
              </Well>
            </Collapse>
          </Col>

          <Col xs={6}>
              { this.props.info.color ? 
                <div style={previewStyle} />
              :
              // TODO update with image support later
              <img src="asdf" />
              }
          </Col>
        </Row>
      </div>
    );
  }
}

PlotInfo.propTypes = {
  info: React.PropTypes.shape({
    rect: React.PropTypes.object.isRequired,
    data: React.PropTypes.object.isRequired,
    zoneIndex: React.PropTypes.number.isRequired,
  }),
  contractInfo: React.PropTypes.object.isRequired
};

export default PlotInfo;