import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Enums from '../constants/Enums';

import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AddCircle from 'material-ui-icons/AddCircle';
import AttachMoney from 'material-ui-icons/AttachMoney';
import Divider from 'material-ui/Divider';

const styles = theme => ({
  root: {
    padding: 16
  }
});

class PendingTransaction extends Component {
  render() {
    const etherscanUrl = `https://etherscan.io/tx/${this.props.txHash}`;
    const isAuction = (this.props.txType === Enums.TxType.AUCTION);
    const txText = (isAuction) ? "Purchase Transaction Started" : "Sale Transaction Started";

    return (
      <ListItem>
        <Avatar>
          {(isAuction) ?
          (<AttachMoney />) :
          (<AddCircle />)}
        </Avatar>
        <ListItemText primary={txText} secondary={<a href={etherscanUrl}>{this.props.txHash}</a>} />
      </ListItem>
    );
  }
}

PendingTransaction.propTypes = {
  txHash: PropTypes.string.isRequired,
  txType: PropTypes.number.isRequired,
};

export default withStyles(styles)(PendingTransaction);