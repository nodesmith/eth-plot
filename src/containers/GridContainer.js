import React, { Component } from 'react';
import Grid from '../components/Grid';
import { Button } from 'react-bootstrap';
import PurchaseModal from '../components/PurchaseModal';

export default class GridContainer extends Component {
  render() {
    return (
      <div>
        <Grid {...this.props} />
        <Button onClick={this.props.actions.enterBuyMode}>Purchase Region</Button>
        <PurchaseModal {...this.props} isVisible={this.props.purchaseDialogVisible} rectToPurchase={this.props.rectToPurchase} closeDialog={this.props.actions.hidePurchaseDialog} />
      </div>
    );
  }
}