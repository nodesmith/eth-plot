import React, { Component, PropTypes } from 'react';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon } from 'react-bootstrap';

export default class PlotPurchaseForm extends Component {
  render() {
    const imageLabel = `Plot Image (${this.props.rectToPurchase.w} x ${this.props.rectToPurchase.h})`;

    return (
      <div>
        <form>
          <FormGroup controlId='imageSelection' >
            <ControlLabel>{imageLabel}   <Glyphicon glyph='info-sign' /></ControlLabel>
            <InputGroup>
              <InputGroup.Button>
                <Button>Browse...</Button>
              </InputGroup.Button>
              <FormControl type="text" />
            </InputGroup>
          </FormGroup>

          <FormGroup controleId='websiteEntry'>
            <ControlLabel>Website</ControlLabel>
            <FormControl type="text" />
          </FormGroup>

          <FormGroup controleId='buyoutPrice'>
            <ControlLabel>Initial Buyout Price</ControlLabel>
            <InputGroup>
            <FormControl type="text" />
              <DropdownButton componentClass={InputGroup.Button} id="input-wei" title="wei" > 
                <MenuItem key="wei">wei</MenuItem>
                <MenuItem key="gwei">gwei</MenuItem>
                <MenuItem key="eth">eth</MenuItem>
              </DropdownButton>
            </InputGroup>
          </FormGroup>
        </form>
      </div>);
  }
}

PlotPurchaseForm.propTypes = {
  rectToPurchase: PropTypes.object.isRequired
}
