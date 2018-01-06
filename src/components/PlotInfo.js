import React, { Component } from 'react';
import { Button, Collapse, Input, Well } from 'react-bootstrap';

class PlotInfo extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  updatePrice() {
    this.props.actions.updateAuction(
      this.props.contractInfo,
      this.props.info.zoneIndex,
      100);    
  }

  render() {
    const infoStyle = {
      width: this.props.info.rect.w * 2,
      height: this.props.info.rect.h * 2,
      backgroundColor: this.props.info.color
    };

    return (
      <div className="plot-info">
        <hr />
        { this.props.info.color ? 
          <div style={infoStyle}/>
        :
        <img src="asdf" />
        }
        <p>Plot url: {this.props.info.data.url}</p>
        
        { this.props.info.txHash ?
          <p>Trasaction in progress: {this.props.info.txHash}</p>
          : null
        }

        <div>
        <p>Buyout price per pixel: {this.props.info.buyoutPrice}</p>
        <Button onClick={() => this.setState({ open: !this.state.open })}>Sell</Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              <div className="wellPadding">
                <Button onClick={this.updatePrice.bind(this)}>Test</Button>
              </div>
            </Well>
          </div>
        </Collapse>
        </div>
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