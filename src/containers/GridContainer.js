import React, { Component } from 'react';
import Grid from '../components/Grid';
import { Button } from 'react-bootstrap';
import PurchaseModal from '../components/PurchaseModal';

export default class GridContainer extends Component {
  render() {
    const modal = this.props.purchaseDialogVisible ? 
      (<PurchaseModal {...this.props} purchaseInfo={this.props.purchaseInfo} isVisible={!!this.props.purchaseDialogVisible} rectToPurchase={this.props.rectToPurchase} closeDialog={this.props.actions.hidePurchaseDialog} />)
      : null;
    return (
      <div>
        <Grid {...this.props} />
        <Button onClick={this.props.actions.enterBuyMode}>Purchase Region</Button>
        {modal}
      </div>
    );
  }
}