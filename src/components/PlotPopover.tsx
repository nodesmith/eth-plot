import MoreVert from '@material-ui/icons/MoreVert';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent, CardHeader, CardMedia } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import { formatEthValueToString } from '../data/ValueFormatters';
import { PlotInfo } from '../models/PlotInfo';


const styles: StyleRulesCallback = theme => ({
  card: {},
  avatar: {
    backgroundColor: theme.palette.grey['300']
  }
});

export interface PlotPopoverProps extends WithStyles {
  plot: PlotInfo;
}

class PlotPopover extends Component<PlotPopoverProps> {

  render() {
    const { classes } = this.props;

    const buyoutPriceMessage = this.props.plot.buyoutPrice > 0 ?
      `${formatEthValueToString(this.props.plot.buyoutPrice.toString())}  per pixel` :
      'Not for sale';

    let title: JSX.Element | string = 'No Website Provided';
    if (this.props.plot.data.url) {
      title = (<a target="_blank" href={this.props.plot.data.url}>{this.props.plot.data.url}</a>);
    }

    return (<div>
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar className={classes.avatar} src={`https://ipfs.infura.io/ipfs/${this.props.plot.data.ipfsHash}`} />
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
          <strong>Owner </strong><span>{this.props.plot.owner}</span>
        </Typography>
        <Typography variant="body1">
          <strong>Purchased </strong><span>{'May 12, 2017'}</span>
        </Typography>
        <Typography variant="body1">
          <strong>Zone Index </strong><span>{this.props.plot.zoneIndex}</span>
        </Typography>

      </CardContent>
      <CardActions>
        <Button size="small" color="primary">View Transaction</Button>
      </CardActions>
    </Card>
    </div>);
  }
}

export default withStyles(styles)(PlotPopover);

    
