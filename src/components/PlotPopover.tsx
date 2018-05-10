import MoreVert from '@material-ui/icons/MoreVert';
import { BigNumber } from 'bignumber.js';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import * as moment from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { formatEthValueToString } from '../data/ValueFormatters';
import { PlotInfo, PurchaseEventInfo } from '../models/PlotInfo';


const styles: StyleRulesCallback = theme => ({
  card: {},
  avatar: {
    backgroundColor: theme.palette.grey['300']
  }
});

export interface PlotPopoverProps extends WithStyles {
  plot: PlotInfo;
  purchaseEventInfo: PurchaseEventInfo;
}

class PlotPopover extends React.Component<PlotPopoverProps> {

  viewTransaction() {
    const viewTransactionLink = `https://etherscan.io/tx/${this.props.purchaseEventInfo.txHash}`;
    window.open(viewTransactionLink, '_blank');
  }

  render() {
    const { classes } = this.props;

    const buyoutPricePerPixelInWeiBN = new BigNumber(this.props.plot.buyoutPricePerPixelInWei);
    const buyoutPriceMessage = buyoutPricePerPixelInWeiBN.greaterThan(0) ?
      `${formatEthValueToString(this.props.plot.buyoutPricePerPixelInWei.toString())}  per pixel` :
      'Not for sale';

    let title: JSX.Element | string = 'No Website Provided';
    if (this.props.plot.data.url) {
      title = (<a target="_blank" href={this.props.plot.data.url}>{this.props.plot.data.url}</a>);
    }

    let purchaseDateMessage = `Block ${this.props.purchaseEventInfo.blockNumber}`;
    if (this.props.purchaseEventInfo.timestamp) {
      const purchaseDate = new Date(this.props.purchaseEventInfo.timestamp * 1000);
      purchaseDateMessage = moment(purchaseDate).fromNow();
    }

    return (<div>
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}
           src={this.props.plot.data.blobUrl} />
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={title}
        subheader={buyoutPriceMessage}
      />
      <CardContent>
        <Typography variant="body1">
          <strong>Owner: </strong><span>{this.props.plot.owner}</span>
        </Typography>
        <Typography variant="body1">
          <strong>Purchased: </strong><span>{purchaseDateMessage}</span>
        </Typography>
        <Typography variant="body1">
          <strong>Purchase Price: </strong><span>{formatEthValueToString(this.props.purchaseEventInfo.purchasePrice)}</span>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={this.viewTransaction.bind(this)}>View Transaction</Button>
      </CardActions>
    </Card>
    </div>);
  }
}

export default withStyles(styles)(PlotPopover);

    
