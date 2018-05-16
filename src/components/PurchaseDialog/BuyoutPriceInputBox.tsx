import { BigNumber } from 'bignumber.js';
import { Decimal } from 'decimal.js';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import { FormControlLabel } from 'material-ui/Form';
import Menu, { MenuItem } from 'material-ui/Menu';
import Switch from 'material-ui/Switch';
import TextField from 'material-ui/TextField';
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
  buyoutPricePerPixelInWei: string;
  toggleEnabled: boolean;
  onBuyoutChanged: (message:{value: string}) => void;
  onToggleChanged: (checked: boolean) => void;
  buyoutVisible: boolean;
  toggleText: string;
  purchasePrice: string; // Should be a serialized Decimal.js of wei
  initialPriceInEth?: string;
}

interface BuyoutPriceInputBoxState {
  buyoutUnits: string;
  anchorEl?: HTMLElement;
  currentInput: string;
}

class BuyoutPriceInputBox extends React.Component<BuyoutPriceInputBoxProps, BuyoutPriceInputBoxState> {
  constructor(props, context) {
    super(props, context);

    if (!props.buyoutPricePerPixelInWei) {
      // In next project, we should use PropTypes Instead
      throw 'Buyout price must be set before using BuyoutPriceInputBox';
    }

    const initialPriceString = new BigNumber(props.buyoutPricePerPixelInWei).div(10e17).toFixed(6);

    this.state = {
      buyoutUnits: 'eth',
      anchorEl: undefined,
      // The state of the input is tracked separately instead of being based solely on the props.
      // This allows us to keep the props in sync with the true value in wei (i.e. "0 wei") while 
      // still displaying exactly what the user types "0.0"
      currentInput: initialPriceString
    };
  }

  buyoutPriceChanged(event) {
    this.setState({ currentInput: event.target.value });

    const units = this.state.buyoutUnits;
    let newPriceInWeiPerPixel = '';

    if (event.target.value.length > 0) {
      const mulitplier = units === 'wei' ? 0 : units === 'gwei' ? 9 : 18;
      newPriceInWeiPerPixel = new Decimal(event.target.value + `e${mulitplier}`).toFixed();
    }

    const buyoutChangedMessage = {
      value: newPriceInWeiPerPixel
    };

    this.props.onBuyoutChanged(buyoutChangedMessage);
  }

  buyoutUnitChanged(event, newBuyoutUnits) {
    let buyoutString: string = this.state.currentInput;
    
    if (this.state.buyoutUnits === newBuyoutUnits) {
      buyoutString = this.state.currentInput;
    } else if (this.state.currentInput) {
      const currentBuyout = new Decimal(this.state.currentInput);

      switch (newBuyoutUnits) {
        case 'eth': 
          buyoutString = (this.state.buyoutUnits === 'gwei') 
                           ? currentBuyout.div(10e8).toFixed()   // Converting from gwei to eth
                           : currentBuyout.div(10e17).toFixed(); // Converting from wei to eth
          break;
        case 'gwei':
          buyoutString = (this.state.buyoutUnits === 'eth') 
                           ? currentBuyout.mul(10e8).toFixed()  // Converting from eth to gwei
                           : currentBuyout.div(10e8).toFixed(); // Converting from wei to gwei
          break;
        case 'wei':
          buyoutString = (this.state.buyoutUnits === 'eth') 
                           ? currentBuyout.mul(10e17).toFixed() // Converting from eth to wei
                           : currentBuyout.mul(10e8).toFixed(); // Converting from gwei to wei
          break;
        default:
          throw 'Unknown buyout units type.';
      }
    }

    this.setState({
      buyoutUnits: newBuyoutUnits,
      currentInput: buyoutString,
    });
    
    this.handleUnitsMenuClosed();
  }

  validateBuyout(buyoutPricePerPixelInWei, toggleEnabled) {
    if (!buyoutPricePerPixelInWei || buyoutPricePerPixelInWei.length === 0) {
      return {
        state: null,
        message: `The price per pixel you are willing to sell your plot for.  In total you will receive this number
                  multipled by the area of your plot.`
      };
    }

    if (!toggleEnabled) {
      return {
        state: null,
        message: 'Buyout disabled. Your plot will not be listed for sale, but you can change this later in the "My Plots" page.'
      };
    }

    const price = new Decimal(buyoutPricePerPixelInWei);

    if (price.lessThan(1)) {
      return {
        state: 'error',
        message: 'Buyout price must be more than 1 wei'
      };
    }

    if (this.props.purchasePrice) {
      const area = this.props.rectToPurchase.w * this.props.rectToPurchase.h;
      const purchasePricePerPixel = new Decimal(this.props.purchasePrice).div(area);
      if (price.lessThan(purchasePricePerPixel)) {
        return {
          state: 'warning',
          message: 'Your buyout price is less than your purchase price'
        };
      }
    }

    const area = this.props.rectToPurchase.w * this.props.rectToPurchase.h;
    const totalBuyout = price.mul(area);
    const buyoutPrice = formatEthValue(totalBuyout);

    return {
      state: 'success',
      message: `You will receive a total of ${buyoutPrice.value} ${buyoutPrice.unit}
                if all pixels in your plot are sold.`
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
    const { buyoutPricePerPixelInWei, toggleEnabled, classes } = this.props;
    const { anchorEl, buyoutUnits } = this.state;

    const validation = this.validateBuyout(buyoutPricePerPixelInWei, toggleEnabled);
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
            label="Buyout Price Per Pixel"
            disabled={!toggleEnabled}
            value={this.state.currentInput}
            className={classes.numberInput}
            margin="normal"
            onChange={this.buyoutPriceChanged.bind(this)}
            helperText={validation.message}
            type="number"
            autoComplete="off"
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
