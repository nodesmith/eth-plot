import { Decimal } from 'decimal.js';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import { FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import IconButton from 'material-ui/IconButton';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import Menu, { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { formatEthValue } from '../../data/ValueFormatters';
import { Rect } from '../../models';

const styles: StyleRulesCallback = theme => ({
  numberInput: {
    width: '75%',
    marginRight: theme.spacing.unit,
  },
  unitSelect: {
    width: `20%`
  },
  toggle: {
    color: 'primary'
  }
});


export interface BuyoutPriceInputBoxProps extends WithStyles {
  rectToPurchase: Rect;
  title: string;
  buyoutPriceInWei: string;
  toggleEnabled: boolean;
  onBuyoutChanged: (message:{value: string}) => void;
  onToggleChanged: (checked: boolean) => void;
  buyoutVisible: boolean;
  toggleText: string;
  purchasePrice: string; // Should be a serialized Decimal.js of wei
}

interface BuyoutPriceInputBoxState {
  buyoutUnits: string;
  anchorEl?: HTMLElement;
}

class BuyoutPriceInputBox extends React.Component<BuyoutPriceInputBoxProps, BuyoutPriceInputBoxState> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      buyoutUnits: 'wei',
      anchorEl: undefined
    };
  }

  buyoutPriceChanged(event) {
    const units = this.state.buyoutUnits;
    let newPriceInWei = '';

    if (event.target.value.length > 0) {
      const mulitplier = units === 'wei' ? 0 : units === 'gwei' ? 9 : 18;
      newPriceInWei = new Decimal(event.target.value + `e${mulitplier}`).toFixed();
    }

    const buyoutChangedMessage = {
      value: newPriceInWei
    };

    this.props.onBuyoutChanged(buyoutChangedMessage);
  }

  buyoutUnitChanged(event, buyoutUnits) {
    this.setState({
      buyoutUnits
    });

    this.handleUnitsMenuClosed();
  }

  validateBuyout(buyoutPriceInWei, toggleEnabled) {
    if (!buyoutPriceInWei || buyoutPriceInWei.length === 0) {
      return {
        state: null,
        message: 'The price you will receive if your full plot is purchased'
      };
    }

    if (!toggleEnabled) {
      return {
        state: null,
        message: 'Buyout disabled. Go to My Plots to set a buyout price'
      };
    }

    const price = new Decimal(buyoutPriceInWei);

    if (price.lessThanOrEqualTo(0)) {
      return {
        state: 'error',
        message: 'Buyout price must be more than 0'
      };
    }


    if (this.props.purchasePrice) {
      const purchasePrice = new Decimal(this.props.purchasePrice);
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

  showUnitsMenu(event: Event) {
    this.setState({ anchorEl: event.currentTarget as HTMLElement });
  }

  handleUnitsMenuClosed() {
    this.setState({ anchorEl: undefined });
  }
  
  render() {
    const { buyoutPriceInWei, toggleEnabled, classes } = this.props;
    const { anchorEl, buyoutUnits } = this.state;

    const buyoutMultiplier = buyoutUnits === 'eth' ? -18 : buyoutUnits === 'gwei' ? -9 : 0;
    const buyoutString = buyoutPriceInWei.length > 0 ? new Decimal(buyoutPriceInWei + `e${buyoutMultiplier}`).toFixed() : '';

    const validation = this.validateBuyout(buyoutPriceInWei, toggleEnabled);

    const currencies = ['wei', 'gwei', 'eth'];

    return (<div>
      <FormControlLabel
          control={
            <Switch color="primary" checked={toggleEnabled} onChange={this.allowBuyoutChanged.bind(this)} />
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
            aria-owns={anchorEl ? 'units-menu' : undefined}
            aria-haspopup="true"
          />
          <Menu
              id="units-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleUnitsMenuClosed.bind(this)}
            >
            {currencies.map(option => (
              <MenuItem 
                selected={option === buyoutUnits} key={option} value={option} onClick={(event) => this.buyoutUnitChanged(event, option)}>
                {option}
              </MenuItem>
            ))}
          </Menu> 
        </div>
       ) : null }
    </div>);
  }
}

export default withStyles(styles)(BuyoutPriceInputBox);
