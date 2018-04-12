import * as React from 'react';

import AccountManager from '../components/AccountManager';
import { ContractInfo, PlotInfo } from '../models';

export interface AccountManagerContainerProps {
  metamaskState: number;
  actions: any; // TODO
  contractInfo: ContractInfo;
  activeAccount: string;
  plots: Array<PlotInfo>
};

class AccountManagerContainer extends React.Component<AccountManagerContainerProps> {
  updatePrice(zoneIndex, buyoutPrice) {
    this.props.actions.updateAuction(
      this.props.contractInfo, zoneIndex, buyoutPrice);    
  }

  render() {
    let userPlots = this.props.plots ? this.props.plots.filter((plot) => {
      if (plot.owner === this.props.activeAccount) {
        return plot;
      }
    }) : [];

    return (
      <AccountManager 
        classes={{}}
        userPlots={userPlots} 
        metamaskState={this.props.metamaskState}
        updatePrice={this.updatePrice.bind(this)}
      />
    );
  }
}

export default AccountManagerContainer;