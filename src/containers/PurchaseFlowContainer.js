import React, { Component, PropTypes } from 'react';
import { Button, Grid, Row, PageHeader } from 'react-bootstrap';
import PurchaseModal from '../components/PurchaseModal';

export default class PurchaseFlowContainer extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <PageHeader>
            Purchase a Plot <small>{this.props.rectToPurchase.w} x {this.props.rectToPurchase.h}</small>
            
          </PageHeader>
        </Row>
      </Grid>
    )
  }
}

PurchaseModal.propTypes = {
  rectToPurchase: PropTypes.object.isRequired
};