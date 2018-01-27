import React, { Component } from 'react';
import { Button, ControlLabel, DropdownButton, MenuItem, FormControl, FormGroup, Label, InputGroup, Modal, PageHeader, Row, Col, Glyphicon, Image, HelpBlock, Checkbox } from 'react-bootstrap';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

class WebsiteInputBox extends Component {
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

    const websiteChangedMessage = {
      valid: validation.state !== 'error',
      value: newValue
    };

    this.props.onWebsiteChanged(websiteChangedMessage);
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
    const { classes } = this.props;
    const error = this.state.websiteValidation.state == 'error';
    return (<TextField
      error={error}
      fullWidth
      id="website"
      label="Plot Website"
      className={classes.textField}
      helperText={this.state.websiteValidation.message}
      onChange={this.websiteChanged.bind(this)}
      margin="normal"
      value={this.props.website}
    />);
  }
}

WebsiteInputBox.propTypes = {
  onWebsiteChanged: PropTypes.func.isRequired,
  website: PropTypes.string.isRequired
}


export default withStyles(styles)(WebsiteInputBox);