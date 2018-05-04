import { withStyles, StyleRulesCallback, WithStyles } from 'material-ui/styles';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Component } from 'react';

import Typography from 'material-ui/Typography/Typography';

import * as Enums from '../constants/Enums';

const styles: StyleRulesCallback = theme => ({
  logo: {
    width: '40%',
    height: '40%'
  },
  installMetamask: {
    textAlign: 'center'
  }
});

export interface MetaMaskStatusProps extends WithStyles {
  metamaskState: Enums.METAMASK_STATE;
}

class MetaMaskStatus extends Component<MetaMaskStatusProps> {
  render() {
    if (this.props.metamaskState === Enums.METAMASK_STATE.OPEN) {
      return null;
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.UNINSTALLED) {
      return (
      <div className={this.props.classes.installMetamask}>
        <Typography gutterBottom variant="subheading">
          You must have MetaMask intalled to use EthGrid.  Check it out here:
        </Typography>
        <a href={'https://metamask.io'} target="_blank">
          <img className={this.props.classes.logo} src={'../assets/metamasklogo.png'} />
        </a>
      </div>
      );
    } else if (this.props.metamaskState === Enums.METAMASK_STATE.LOCKED) {
      return (
        <Typography gutterBottom variant="subheading">
          You must unlock MetaMask to proceed.
        </Typography>
      );
    }
  }
}

export default withStyles(styles)(MetaMaskStatus);
