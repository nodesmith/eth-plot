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
import PlotPreviewCard from './PlotPreviewCard';
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
    const plotURL = (this.props.info.data.url) ? this.props.info.data.url : 'None';
    const forSale = (this.props.info.buyoutPrice > 0);

    return (
      <Grid className={this.props.classes.root} container spacing={8}>
        <Grid item xs={12} sm={6} >
          <PlotPreviewCard imgUrl={this.props.info.data.imageUrl} 
                           w={this.props.info.rect.w}
                           h={this.props.info.rect.h}
                           classes={{}} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Plot url" value={plotURL} urlLink={this.props.info.data.url}/>
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Purchase Transaction" value="0xa0ecf2be42aad5f15a679387b1007154b49773af3ea001b659cc2e3579e5c63a" urlLink="https://etherscan.io/tx/0xa0ecf2be42aad5f15a679387b1007154b49773af3ea001b659cc2e3579e5c63a"/>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Plot for Sale" value ={(forSale) ? 'Yes' : 'No'} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Original Purchase Price" value ="10.4 ETH" />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Buyout Price Per Pixel" value ="0.02 ETH" />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Total Unsold Pixels" value ="12/25" />
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
