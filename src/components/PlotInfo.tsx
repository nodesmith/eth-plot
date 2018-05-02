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
import * as PlotMath from '../data/PlotMath';

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
  holes: Array<Rect>;
  updatePrice: (zoneIndex: number, newBuyoutPrice: string) => void;
}

interface PlotInfoState {
  newBuyoutPrice: string;
  toggleEnabled: boolean;
  auctionVisible: boolean;
}

export interface PixelStatus {
  soldPixels: Array<boolean>; 
  soldPixelCount: number;
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

  /**
   * Computes an array with a single entry for each pixel in this plot.
   * The entry is true if the pixel has been sold and false otherwise.
   */
  computePixelStatus(): PixelStatus {
    let pixelStatus: Array<boolean> = [];
    let soldPixelCount = 0;

    let startingX = this.props.info.rect.x;
    let startingY = this.props.info.rect.y;
    let endingX = startingX + this.props.info.rect.w;
    let endingY = startingY + this.props.info.rect.h;

    for (let x = startingX; x < endingX; x++) {
      for (let y = startingY; y < endingY; y++) {
        let pixelSold = false;

        this.props.holes.forEach(hole => {
          if (PlotMath.pixelInsideRectangle(hole, x, y)) {
            pixelSold = true;
            soldPixelCount++;
          }
        });
  
        pixelStatus.push(pixelSold);
      }
    }

    // Return in a wrapped interace that also includes the total number of sold
    // pixels for this plot.  This wrapper can be passed down to child components. 
    return {
      soldPixels: pixelStatus,
      soldPixelCount: soldPixelCount
    };
  }

  render() {
    const plotURL = (this.props.info.data.url) ? this.props.info.data.url : 'None';
    const forSale = (this.props.info.buyoutPrice > 0);

    const pixelStatus = this.computePixelStatus();
    const totalPixels = this.props.info.rect.w * this.props.info.rect.h;

    return (
      <Grid className={this.props.classes.root} container spacing={8}>
        <Grid item xs={12} sm={6} >
          <PlotPreviewCard blobUrl={this.props.info.data.blobUrl} 
                           w={this.props.info.rect.w}
                           h={this.props.info.rect.h}
                           pixelStatus={pixelStatus}
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
              <TextLabel caption="Plot for Sale" value={(forSale) ? 'Yes' : 'No'} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Original Purchase Price" value='10 ETH' />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <TextLabel caption="Buyout Price Per Pixel" value={(forSale) ? `${this.props.info.buyoutPrice} wei` : 'NA'} />
            </Grid>
            <Grid item xs={6}>
              <TextLabel caption="Number of Pixels Sold" value={`${pixelStatus.soldPixelCount} of ${totalPixels}`} />
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
