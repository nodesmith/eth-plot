import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon, Image, HelpBlock, Checkbox } from 'react-bootstrap';
import Decimal from 'decimal.js';
import { formatEthValue } from '../../data/ValueFormatters';

export default class BuyoutPriceInputBox extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      buyout: this.props.initialValue,
      buyoutValidation: this.validateBuyout(this.props.initialValue, true),
      buyoutEnabled: true,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.buyoutValidation.state != prevState.buyoutValidation.state) {
      const buyoutState = {
        ammountInWei: this.state.buyout.ammountInWei,
        buyoutEnabled: this.state.buyoutEnabled,
        valid: !this.state.buyoutEnabled || this.state.buyoutValidation.state === 'success' || this.state.buyoutValidation.state === 'warning'
      };
    }
  }

  buyoutPriceChanged(event) {
    const units = this.state.buyout.units;
    let newBuyout = {
      units: units,
      ammountInWei: ''
    };

    if (event.target.value.length > 0) {
      const mulitplier = units == 'wei' ? 0 : units == 'gwei' ? 9 : 18;
      const newPriceInWei = Decimal(event.target.value + `e${mulitplier}`);
      newBuyout.ammountInWei = newPriceInWei.toFixed();
    }

    const buyoutValidation = this.validateBuyout(newBuyout, this.state.buyoutEnabled);

    this.setState({
      buyout: newBuyout,
      buyoutValidation: buyoutValidation
    });

    const buyoutChangedMessage = {
      value: newBuyout.ammountInWei,
      valid: buyoutValidation.state !== 'error'
    };

    this.props.onBuyoutChanged(buyoutChangedMessage);
  }

  buyoutUnitChanged(eventKey, event) {
    const buyoutUnits = eventKey;

    const newBuyout = {
      units: buyoutUnits,
      ammountInWei: this.state.buyout.ammountInWei
    };

    const buyoutValidation = this.validateBuyout(newBuyout, this.state.buyoutEnabled);

    this.setState({
      buyout: newBuyout,
      buyoutValidation: buyoutValidation
    });
  }

  validateBuyout(buyout, buyoutEnabled) {
    if (!buyout || buyout.ammountInWei.length === 0) {
      return {
        state: null,
        message: 'The price you will receive if your full plot is purchased'
      }
    }

    if (!buyoutEnabled) {
      return {
        state: null,
        message: 'Buyout disabled. Go to My Plots to set a buyout price'
      };
    }

    const price = Decimal(buyout.ammountInWei);

    if (price.lessThanOrEqualTo(0)) {
      return {
        state: 'error',
        message: 'Buyout price must be more than 0'
      };
    }

    const purchasePrice = Decimal(this.props.purchasePrice);
    if (price.lessThan(purchasePrice)) {
      return {
        state: 'warning',
        message: 'Your buyout price is less than your purchase price'
      };
    }

    const area = this.props.rectToPurchase.w * this.props.rectToPurchase.h;
    const buyoutPerUnit = price.div(area);
    const buyoutPrice = formatEthValue(buyoutPerUnit);
    return {
      state: 'success',
      message: `You will receive ${buyoutPrice.value} ${buyoutPrice.unit} per unit`
    };
  }

  allowBuyoutChanged(event) {
    const newValue = event.target.checked;
    const buyoutValidation = this.validateBuyout(this.state.buyout, newValue);

    this.setState({
      buyoutEnabled: newValue,
      buyoutValidation: buyoutValidation
    });
  }

  render() {
    const buyoutMultiplier = this.state.buyout.units == 'eth' ? -18 : this.state.buyout.units == 'gwei' ? -9 : 0;
    const buyoutString = this.state.buyout.ammountInWei.length > 0 ? Decimal(this.state.buyout.ammountInWei + `e${buyoutMultiplier}`).toFixed() : '';

    return (
      <FormGroup controlId='buyoutPrice' validationState={this.state.buyoutValidation.state}>
        <ControlLabel>{this.props.title}</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>
            <input type="checkbox" aria-label="Allow Initial Buyout" checked={this.state.buyoutEnabled} onChange={this.allowBuyoutChanged.bind(this)}/>
          </InputGroup.Addon>
          <FormControl disabled={!this.state.buyoutEnabled} value={buyoutString} type="number" onChange={this.buyoutPriceChanged.bind(this)}/>
          <DropdownButton disabled={!this.state.buyoutEnabled} componentClass={InputGroup.Button} id="input-wei" title={this.state.buyout.units} onSelect={this.buyoutUnitChanged.bind(this)} > 
            <MenuItem eventKey="wei">wei</MenuItem>
            <MenuItem eventKey="gwei">gwei</MenuItem>
            <MenuItem eventKey="eth">eth</MenuItem>
          </DropdownButton>
        </InputGroup>
        <HelpBlock>{this.state.buyoutValidation.message}</HelpBlock>
      </FormGroup>
    );
  }
}

BuyoutPriceInputBox.propTypes = {
  rectToPurchase: PropTypes.object.isRequired,
  purchasePrice: PropTypes.string.isRequired, // Should be a serialized Decimal.js of wei
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.object.isRequired,
  onBuyoutChanged: PropTypes.func.isRequired
}
