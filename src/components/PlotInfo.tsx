import ExpandMore from 'material-ui-icons/ExpandMore';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { PlotInfo as PlotInfoData, Rect } from '../models';

import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';
import TextLabel from './TextLabel';

const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 16
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  divider: {
    marginTop: 16
  }
});

export interface PlotInfoProps extends WithStyles {
  info: PlotInfoData;
  updatePrice: (zoneIndex: number, newBuyoutPrice: string) => void;
}

interface PlotInfoState {
  newBuyoutPrice: string;
  toggleEnabled: boolean;
  auctionVisible: boolean;
}

class PlotInfo extends React.Component<PlotInfoProps, PlotInfoState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      newBuyoutPrice: '0',
      toggleEnabled: false,
      auctionVisible: false
    };
  }
  
  onBuyoutChanged(buyoutChangedMessage) {
    this.setState({ newBuyoutPrice: buyoutChangedMessage.value });
  }

  onToggleChanged() {
    this.setState({
      toggleEnabled: !this.state.toggleEnabled,
      auctionVisible: !this.state.auctionVisible,
    });
  }

  updatePrice() {
    this.props.updatePrice(this.props.info.zoneIndex, this.state.newBuyoutPrice);    
  }

  render() {
    const previewStyle = {
      backgroundColor: this.props.info.color,
      width: `200px`,
      height: `200px`,
    };

    const imageStyle = {
      width: `${this.props.info.rect.w}px`,
      height: `${this.props.info.rect.w}px`,
    }

    return (
      <Grid className={this.props.classes.root} container spacing={8} justify="space-around">
        <Grid item xs={12} sm={6} >
          <img src={this.props.info.data.imageUrl} height={'100%'} width={'100%'} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Plot url" value={this.props.info.data.url} urlLink={this.props.info.data.url}/>
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Buyout price per pixel" value=
                {(this.props.info.buyoutPrice > 0) ? this.props.info.buyoutPrice : 'Not For Sale'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Purchase Date" value ="10/24/2081" />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Purchase Price" value ="10.4 ETH" />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Total Remaining Pixels" value ="12/25" />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Total Remaining Pixels" value ="12/25" />
            </Grid>
          </Grid>
          <Divider className={this.props.classes.divider} light />
          <BuyoutPriceInputBox
            onBuyoutChanged={this.onBuyoutChanged.bind(this)}
            onToggleChanged={this.onToggleChanged.bind(this)}
            rectToPurchase={this.props.info.rect}
            buyoutPriceInWei={this.state.newBuyoutPrice}
            toggleEnabled={this.state.toggleEnabled}
            toggleText={'Edit Buyout'}
            title={'Buyout Price'}
            initialValue={{ units: 'wei', ammountInWei: 500 }}
            buyoutVisible={this.state.auctionVisible}
          />
          {this.state.toggleEnabled ? (
            <Button variant="raised" color="primary" className={this.props.classes.button} onClick={this.updatePrice.bind(this)}>Update Buyout</Button>
           ) : null }
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PlotInfo);
