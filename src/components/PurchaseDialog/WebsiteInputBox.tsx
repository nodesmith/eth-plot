import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import * as React from 'react';

const styles: StyleRulesCallback = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});


export interface WebsiteInputBoxPropTypes extends WithStyles {
  onWebsiteChanged: (message: {valid: boolean; value: string}) => void;
  website: string;
}

interface WebsiteValidation {
  state: string | null;
  message: string;
}


class WebsiteInputBox extends React.Component<WebsiteInputBoxPropTypes, {website:string, websiteValidation: WebsiteValidation}> {
  constructor(props, context) {
    super(props, context);

    this.state = {
      website: '',
      websiteValidation: this.validateWebsite(undefined)
    };
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

  validateWebsite(website?: string): WebsiteValidation {
    if (!website || website.length === 0) {
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
    const error = this.state.websiteValidation.state === 'error';
    return (<TextField
      error={error}
      fullWidth
      id="website"
      label="Plot Website"
      className={classes.textField}
      helperText={this.state.websiteValidation.message}
      onChange={this.websiteChanged.bind(this)}
      margin="normal"
      placeholder="http://"
      value={this.props.website}
    />);
  }
}

export default withStyles(styles)(WebsiteInputBox);
