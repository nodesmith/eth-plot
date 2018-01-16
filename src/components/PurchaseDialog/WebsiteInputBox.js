import React, { Component, PropTypes } from 'react';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon, Image, HelpBlock, Checkbox } from 'react-bootstrap';

export default class WebsiteInputBox extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      website: '',
      websiteValidation: this.validateWebsite(null)
    }
  }

  websiteChanged(event) {
    const newValue = event.target.value;
    const validation = this.validateWebsite(newValue);
    this.setState({
      website: newValue,
      websiteValidation: validation
    });
  }

  validateWebsite(website) {
    if (!website || website.length == 0) {
      return {
        state: null,
        message: 'The website where your plot links to'
      };
    }

    if (website.length < 7 || (website.indexOf('http://') !== 0 && website.indexOf('https://') !== 0)) {
      return {
        state: 'error',
        message: `The website must start with 'http://' or 'https://'`
      };
    }

    if (website.length > 2048) {
      return {
        state: 'error',
        message: `The website must be less than 2048 characters (${website.length} characters)`
      };
    }

    return {
      state: 'success',
      message: `Users will go to ${website} when clicking your plot`
    };
  }

  render() {
    return (
      <FormGroup controleId='websiteEntry' validationState={this.state.websiteValidation.state}>
        <ControlLabel>Website</ControlLabel>
        <FormControl type="url" onChange={this.websiteChanged.bind(this)}/>
        <FormControl.Feedback />
        <HelpBlock>{this.state.websiteValidation.message}</HelpBlock>
      </FormGroup>
    );
  }
}

WebsiteInputBox.propTypes = {
}
