import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AccountManager from '../components/AccountManager';

class AccountManagerContainer extends Component {
  render() {
    let userPlots = this.props.plots ? this.props.plots.filter((plot) => {
      if (plot.owner === this.props.activeAccount) {
        return plot;
      }
    }) : [];

    return (
      <AccountManager 
        userPlots={userPlots} 
        metamaskState={this.props.metamaskState}
        actions={this.props.actions}
        contractInfo={this.props.contractInfo}
        pendingTxs={this.props.pendingTxs}
      />
    );
  }
}

AccountManagerContainer.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  contractInfo: PropTypes.object.isRequired,
  activeAccount: PropTypes.string.isRequired
};

export default AccountManagerContainer;