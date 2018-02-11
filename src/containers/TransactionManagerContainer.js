import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TransactionManager from '../components/TransactionManager';

class TransactionManagerContainer extends Component {
  render() {
    return (
      <TransactionManager 
        metamaskState={this.props.metamaskState}
        pendingTxs={this.props.pendingTxs}
      />
    );
  }
}

TransactionManagerContainer.propTypes = {
  metamaskState: PropTypes.number.isRequired,
  pendingTxs: PropTypes.array.isRequired,
};

export default TransactionManagerContainer;