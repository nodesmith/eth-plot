import React, { Component } from 'react';
import Grid from '../components/Grid';
import { Button } from 'react-bootstrap';

export default class GridContainer extends Component {
  render() {
    return (
      <div>
        <Grid {...this.props} />
        <Button onClick={this.props.actions.enterBuyMode}>Purchase Region</Button>
      </div>
    );
  }
}