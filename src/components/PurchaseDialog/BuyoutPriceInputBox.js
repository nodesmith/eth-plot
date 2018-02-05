import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Decimal from 'decimal.js';
import { formatEthValue } from '../../data/ValueFormatters';


import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';

import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import TextField from 'material-ui/TextField';

const styles = theme => ({
  wrapper: {
    margin: theme.spacing.unit
  },
  numberInput: {
    width: '75%',
    marginRight: theme.spacing.unit,
  },
  unitSelect: {
    width: `20%`
  }
});

class BuyoutPriceInputBox extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      buyoutUnits: 'wei',
      anchorEl: null
    }
  }

  buyoutPriceChanged(event) {
    const units = this.state.buyoutUnits;
    let newPriceInWei = '';

    if (event.target.value.length > 0) {
      const mulitplier = units == 'wei' ? 0 : units == 'gwei' ? 9 : 18;
      newPriceInWei = Decimal(event.target.value + `e${mulitplier}`).toFixed();
    }

    const buyoutChangedMessage = {
      value: newPriceInWei
    };

    this.props.onBuyoutChanged(buyoutChangedMessage);
  }

  buyoutUnitChanged(event, buyoutUnits) {
    this.setState({
      buyoutUnits: buyoutUnits
    });

    this.handleUnitsMenuClosed();
  }

  validateBuyout(buyoutPriceInWei, toggleEnabled) {
    if (!buyoutPriceInWei || buyoutPriceInWei.length === 0) {
      return {
        state: null,
        message: 'The price you will receive if your full plot is purchased'
      }
    }

    if (!toggleEnabled) {
      return {
        state: null,
        message: 'Buyout disabled. Go to My Plots to set a buyout price'
      };
    }

    const price = Decimal(buyoutPriceInWei);

    if (price.lessThanOrEqualTo(0)) {
      return {
        state: 'error',
        message: 'Buyout price must be more than 0'
      };
    }


    if (this.props.purchasePrice) {
      const purchasePrice = Decimal(this.props.purchasePrice);
      if (price.lessThan(purchasePrice)) {
        return {
          state: 'warning',
          message: 'Your buyout price is less than your purchase price'
        };
      }
    }

    const area = this.props.rectToPurchase.w * this.props.rectToPurchase.h;
    const buyoutPerUnit = price.div(area);
    const buyoutPrice = formatEthValue(buyoutPerUnit);
    return {
      state: 'success',
      message: `You will receive ${buyoutPrice.value} ${buyoutPrice.unit} per unit`
    };
  }

  allowBuyoutChanged(event, checked) {
    this.props.onToggleChanged(checked);
  }

  showUnitsMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleUnitsMenuClosed() {
    this.setState({ anchorEl: null });
  }
  
  render() {
    const { buyoutPriceInWei, toggleEnabled, classes } = this.props;
    const { anchorEl, buyoutUnits } = this.state;

    const buyoutMultiplier = buyoutUnits == 'eth' ? -18 : buyoutUnits == 'gwei' ? -9 : 0;
    const buyoutString = buyoutPriceInWei.length > 0 ? Decimal(buyoutPriceInWei + `e${buyoutMultiplier}`).toFixed() : '';

    const validation = this.validateBuyout(buyoutPriceInWei, toggleEnabled)

    const currencies = ['wei', 'gwei', 'eth'];


    return (<div className={classes.wrapper} >
      <FormControlLabel
          control={
            <Switch checked={toggleEnabled} onChange={this.allowBuyoutChanged.bind(this)} />
          }
          label={this.props.toggleText}
        />
      {this.props.buyoutVisible ? (
        <div>
          <TextField
            id="name"
            label="Buyout Price"
            disabled={!toggleEnabled}
            value={buyoutString}
            className={classes.numberInput}
            margin="normal"
            onChange={this.buyoutPriceChanged.bind(this)}
            helperText={validation.message}
          />
          <Chip
            className={classes.unitSelect}
            label={buyoutUnits}
            onClick={toggleEnabled ? this.showUnitsMenu.bind(this) : null}
            aria-owns={anchorEl ? 'units-menu' : null}
            aria-haspopup="true"
          />
          <Menu
              id="units-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleUnitsMenuClosed.bind(this)}
            >
            {currencies.map(option => (
              <MenuItem selected={option === buyoutUnits} key={option} value={option} onClick={(event) => this.buyoutUnitChanged(event, option)}>
                {option}
              </MenuItem>
            ))}
          </Menu> 
        </div>
       ) : null }
    </div>);
  }
}

BuyoutPriceInputBox.propTypes = {
  rectToPurchase: PropTypes.object.isRequired,
  purchasePrice: PropTypes.string.isOptional, // Should be a serialized Decimal.js of wei
  title: PropTypes.string.isRequired,
  initialValue: PropTypes.object.isRequired,
  buyoutPriceInWei: PropTypes.string.isRequired,
  toggleEnabled: PropTypes.bool.isRequired,
  onBuyoutChanged: PropTypes.func.isRequired,
  onToggleChanged: PropTypes.func.isRequired,
  buyoutVisible: PropTypes.bool.isRequired,
  toggleText: PropTypes.string.isRequired,
}

export default withStyles(styles)(BuyoutPriceInputBox);