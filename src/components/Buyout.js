import React, { Component } from 'react';
import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';

import FAQ from './FAQ';

export default class Buyout extends Component {
  constructor(...args) {
		super(...args);
		this.state = {
			newBuyoutPrice: 0
		};
  }

  updatePrice() {
    this.props.actions.updateAuction(
      this.props.contractInfo,
      this.props.zoneIndex,
      this.state.newBuyoutPrice);    
  }

  cancelSale() {
    this.props.actions.updateAuction(
      this.props.contractInfo,
      this.props.zoneIndex, );    
  }

  priceInputChanged(e) {
    this.setState({ newBuyoutPrice: e.target.value });
  }

  getValidationState() {
		const newPrice = this.state.newBuyoutPrice;
		if (newPrice > 0) {
      return 'success';
    } else {
      return 'error';
    }
	}

  render() {
    return (
      <div className="wellPadding">
        <FormGroup
          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Create or update sale for plot: 
            { /* TODO Link to specific FAQ */ }
            <span className="glyphicon glyphicon-info-sign"></span>
          </ControlLabel>
          <FormControl
            type="number"
            value={this.state.value}
            placeholder="New price per pixel (in gwei)"
            onChange={this.priceInputChanged.bind(this)}
            autocomplete="off"
          />
          <p>Total: { this.state.newBuyoutPrice * this.props.totalPixels }</p>
          <FormControl.Feedback />

          <Button onClick={() => this.updatePrice()}>Update Price</Button>
        
          { this.props.currentBuyout > 0 ?
            <div>
              <hr/>
              <Button onClick={() => this.cancelSale()}>Cancel Sale</Button>
            </div>
            : null
          }
        </FormGroup>
      </div>
    );
  }
}
