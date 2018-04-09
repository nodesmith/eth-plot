import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography/Typography';

import * as Enums from '../constants/Enums';

import FullPageStatus from './FullPageStatus';

const styles: StyleRulesCallback = theme => ({
  logoContainer: {
    textAlign: "center"
  },
  logo: {
    width: "40%",
    height: "40%"
  }
});

export interface MetaMaskStatusProps extends WithStyles {
  metamaskState: number;
}

class MetaMaskStatus extends Component<MetaMaskStatusProps> {
  render() {
    if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
      return null;
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.UNINSTALLED) {
      return (
      <div className={this.props.classes.logoContainer}>
        <FullPageStatus classes={this.props.classes} message="You must have MetaMask intalled to use EthGrid.  Check it out here:" />
        <a href={"https://metamask.io"} target="_blank">
          <img className={this.props.classes.logo} src={"../assets/metamasklogo.png"} />
        </a>
      </div>
      );
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.LOCKED) {
      return (
      <div id="metamaskLogoContainer">
        <FullPageStatus classes={this.props.classes} message="You must unlock MetaMask to proceed." />
      </div>
      );
    }
  }
}

export default withStyles(styles)(MetaMaskStatus);