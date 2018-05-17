import { BigNumber } from 'bignumber.js';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import * as React from 'react';

import { formatEthValueToString } from '../data/ValueFormatters';
import { PlotInfo as PlotInfoData, PurchaseEventInfo, Rect } from '../models';

import PlotPreviewCard from './PlotPreviewCard';
import BuyoutPriceInputBox from './PurchaseDialog/BuyoutPriceInputBox';
import TextLabel from './TextLabel';

const styles: StyleRulesCallback = theme => ({
  root: {
    padding: 16
  },
  button: {
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    pointerEvents: 'auto', // This allows captions on disabled buttons
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
  holes: Array<Rect>;
  updatePrice: (zoneIndex: number, newBuyoutPricePerPixel: string) => void;
  purchaseInfo: PurchaseEventInfo;
  isPlotSold: boolean;
}

interface PlotInfoState {
  newBuyoutPricePerPixel: string;
  toggleEnabled: boolean;
  auctionVisible: boolean;
}

class PlotInfo extends React.Component<PlotInfoProps, PlotInfoState> {
  constructor(props, context) {
    super(props, context);

    const purchasePriceBN = new BigNumber(this.props.purchaseInfo.purchasePrice);
    let initialBuyoutPrice = purchasePriceBN.div(this.props.info.rect.w).div(this.props.info.rect.h).toFixed(6);
    
    const buyoutPriceBN = new BigNumber(this.props.info.buyoutPricePerPixelInWei); 
    if (buyoutPriceBN.greaterThan(0)) {
      // A buyout has already been set by this user, so use that as starter buyout.
      initialBuyoutPrice = buyoutPriceBN.toFixed(6);
    }

    this.state = {
      newBuyoutPricePerPixel: initialBuyoutPrice,
      toggleEnabled: false,
      auctionVisible: false
    };
  }
  
  onBuyoutChanged(buyoutChangedMessage) {
    this.setState({ newBuyoutPricePerPixel: buyoutChangedMessage.value });
  }

  onToggleChanged() {
    this.setState({
      toggleEnabled: !this.state.toggleEnabled,
      auctionVisible: !this.state.auctionVisible,
    });
  }

  updatePrice() {
    const newBuyoutPricePerPixelBN = new BigNumber(this.state.newBuyoutPricePerPixel); 
    this.props.updatePrice(this.props.info.zoneIndex, newBuyoutPricePerPixelBN.toString());    
  }

  cancelSale() {
    this.props.updatePrice(this.props.info.zoneIndex, '0');    
  }

  render() {
    const plotURL = (this.props.info.data.url) ? this.props.info.data.url : 'None';
    const buyoutPricePerPixelInWeiBN = new BigNumber(this.props.info.buyoutPricePerPixelInWei);
    const forSale = buyoutPricePerPixelInWeiBN.greaterThan(0);

    let soldPixelCount = 0;
    this.props.holes.forEach((hole: Rect) => {
      soldPixelCount += (hole.w) * (hole.h);
    });
    
    const totalPixels = this.props.info.rect.w * this.props.info.rect.h;

    let forSaleText = (forSale) ? 'Yes' : 'No';
    if (this.props.isPlotSold) forSaleText = 'NA';

    const pixelSoldCountText = (this.props.isPlotSold) ? 'All' : `${soldPixelCount} of ${totalPixels}`;

    const cancelSaleDisabled = buyoutPricePerPixelInWeiBN.equals(0);
    let updateBuyoutDisabled = true;
    if (this.state.newBuyoutPricePerPixel) {
      const newBuyoutPricePerPixelBN = new BigNumber(this.state.newBuyoutPricePerPixel);
      updateBuyoutDisabled = newBuyoutPricePerPixelBN.lessThanOrEqualTo(0);
    }

    const cancelSaleButtonCaption = (cancelSaleDisabled) ? 'This plot isn\'t for sale, there is nothing to cancel.' : '';
    const updateBuyoutButtonCaption = (updateBuyoutDisabled) ? 'A buyout must be above 1 wei in order to update.' : '';

    return (
      <Grid className={this.props.classes.root} container spacing={8}>
        <Grid item xs={12} sm={6} >
          <PlotPreviewCard blobUrl={this.props.info.data.blobUrl} 
                           rect={this.props.info.rect}
                           holes={this.props.holes}
                           isBlockedImage={this.props.info.data.zoneBlocked}
                           classes={{}} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Plot url" value={plotURL} urlLink={this.props.info.data.url}/>
            </Grid>
            <Grid item xs={6}>
              <TextLabel 
                caption="Purchase Transaction"
                value="0xa0ecf2be42aad5f15a679387b1007154b49773af3ea001b659cc2e3579e5c63a"
                urlLink="https://etherscan.io/tx/0xa0ecf2be42aad5f15a679387b1007154b49773af3ea001b659cc2e3579e5c63a"/>
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Plot for Sale" value={forSaleText} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Original Purchase Price" value={formatEthValueToString(this.props.purchaseInfo.purchasePrice.toString())} />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Buyout Price Per Pixel" value={(forSale) ? formatEthValueToString(this.props.info.buyoutPricePerPixelInWei) : 'NA'} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Number of Pixels Sold" value={pixelSoldCountText} />
            </Grid>
          </Grid>
            {(!this.props.isPlotSold) ? 
              <div>
                <Divider className={this.props.classes.divider} light />
                <BuyoutPriceInputBox
                  onBuyoutChanged={this.onBuyoutChanged.bind(this)}
                  onToggleChanged={this.onToggleChanged.bind(this)}
                  rectToPurchase={this.props.info.rect}
                  buyoutPricePerPixelInWei={this.state.newBuyoutPricePerPixel}
                  toggleEnabled={this.state.toggleEnabled}
                  toggleText={'Edit Buyout'}
                  title={'Buyout Price'}
                  buyoutVisible={this.state.auctionVisible}
                />
              </div>
           : null /* isPlotSold */ }
          { this.state.toggleEnabled ? (
            <div>
              <Button 
                variant="raised" 
                color="primary" 
                className={this.props.classes.button} 
                onClick={this.updatePrice.bind(this)}
                disabled={updateBuyoutDisabled}
                title={updateBuyoutButtonCaption}>
                Update Buyout
              </Button>
              <Button 
                variant="raised" 
                color="primary" 
                className={this.props.classes.button} 
                onClick={this.cancelSale.bind(this)}
                disabled={cancelSaleDisabled}
                title={cancelSaleButtonCaption}>
                Cancel Plot Sale
              </Button>
            </div>
           ) : null }
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PlotInfo);
