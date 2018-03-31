import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography/Typography';
import { withStyles } from 'material-ui/styles';

import * as Enums from '../constants/Enums';

import FullPageStatus from './FullPageStatus';

const styles = theme => ({
  logoContainer: {
    textAlign: "center"
  },
  logo: {
    width: "40%",
    height: "40%"
  }
});

class MetaMaskStatus extends Component {
  getStatus() {
    if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
      return null;
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.UNINSTALLED) {
      return (
      <div className={this.props.classes.logoContainer}>
        <FullPageStatus message="You must have MetaMask intalled to use EthGrid.  Check it out here:" />
        <a href={"https://metamask.io"} target="_blank">
          <img className={this.props.classes.logo} src={"../assets/metamasklogo.png"} />
        </a>
      </div>
      );
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.LOCKED) {
      return (
      <div id="metamaskLogoContainer">
        <FullPageStatus message="You must unlock MetaMask to proceed." />
      </div>
      );
    }
  }
  
  render() {
    let content = this.getStatus();

    return (
     content
    );
  }
}

MetaMaskStatus.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MetaMaskStatus);