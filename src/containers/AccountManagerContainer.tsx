import * as React from 'react';

import * as Actions from '../actions';
import AccountManager from '../components/AccountManager';
import { ContractInfo, HoleInfo, PlotInfo, PurchaseEventInfo } from '../models';

export interface AccountManagerContainerProps {
  metamaskState: number;
  actions: {
    updateAuction: Actions.updateAuction
  };
  contractInfo: ContractInfo;
  activeAccount: string;
  plots: Array<PlotInfo>;
  holes: HoleInfo;
  plotTransactions: {[index: number]: PurchaseEventInfo};
  getEtherscanUrl: (txHash: string) => string;
}

class AccountManagerContainer extends React.Component<AccountManagerContainerProps> {
  updatePrice(zoneIndex, buyoutPrice) {
    this.props.actions.updateAuction(
      this.props.contractInfo, zoneIndex, buyoutPrice, this.props.activeAccount);
  }

  render() {
    return (
      <AccountManager 
        classes={{}}
        plots={this.props.plots} 
        metamaskState={this.props.metamaskState}
        updatePrice={this.updatePrice.bind(this)}
        holes={this.props.holes}
        plotTransactions={this.props.plotTransactions}
        activeAccount={this.props.activeAccount}
        getEtherscanUrl={this.props.getEtherscanUrl}
      />
    );
  }
}

export default AccountManagerContainer;
