import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
  Button, 
  Col,
  Collapse,
  ControlLabel,
  FormControl,
  FormGroup,
  Input,
  Row,
  Well
} from 'react-bootstrap';

class PlotInfo extends Component {
  constructor(...args) {
		super(...args);
		this.state = {
			newBuyoutPrice: 0
		};
  }

  updatePrice() {
    this.props.actions.updateAuction(
      this.props.contractInfo,
      this.props.info.zoneIndex,
      this.state.newBuyoutPrice);    
  }

  priceInputChanged(e) {
    this.setState({ newBuyoutPrice: e.target.value });
  }

  render() {
    const previewStyle = {
      backgroundColor: this.props.info.color,
      width: `${this.props.info.rect.w}px`,
      height: `${this.props.info.rect.w}px`,
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

            <h4>Buyout price per pixel: {
              (this.props.info.buyoutPrice > 0) ? this.props.info.buyoutPrice : "Not For Sale" }
            </h4>
         
              <Button onClick={() => this.setState({ open: !this.state.open })}>Update Buyout</Button>
              <Collapse in={this.state.open}>
                <div>
                  <Well>
                    <div className="wellPadding">
                      <FormGroup
                        controlId="formBasicText"
                      >
                        <ControlLabel>New Buyout Price Per Pixel (in Gwei)</ControlLabel>
                        <FormControl
                          type="text"
                          value={this.state.value}
                          placeholder="Enter price (0 to cancel auction)"
                          onChange={this.priceInputChanged.bind(this)}
                        />
                        <FormControl.Feedback />
                        <Button onClick={() => this.updatePrice()}>Save</Button>
                      </FormGroup>
                    </div>
                  </Well>
                </div>
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
  info: PropTypes.shape({
    rect: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    zoneIndex: PropTypes.number.isRequired,
  }),
  contractInfo: PropTypes.object.isRequired
};

export default PlotInfo;