import * as React from 'react';

import AccountManager from '../components/AccountManager';
import { ContractInfo, PlotInfo, HoleInfo } from '../models';

export interface AccountManagerContainerProps {
  metamaskState: number;
  actions: any; // TODO
  contractInfo: ContractInfo;
  activeAccount: string;
  plots: Array<PlotInfo>;
  holes: HoleInfo;
}

class AccountManagerContainer extends React.Component<AccountManagerContainerProps> {
  updatePrice(zoneIndex, buyoutPrice) {
    this.props.actions.updateAuction(
      this.props.contractInfo, zoneIndex, buyoutPrice);    
  }

  render() {
    let filteredHoles: HoleInfo = {};
    let newIndex = 0;

    const userPlots = this.props.plots ? this.props.plots.filter((plot, index) => {
      if (plot.owner === this.props.activeAccount) {
        filteredHoles[newIndex++] = this.props.holes[index];
        return plot;
      }
    }) : [];

    return (
      <AccountManager 
        classes={{}}
        userPlots={userPlots} 
        metamaskState={this.props.metamaskState}
        updatePrice={this.updatePrice.bind(this)}
        holes={filteredHoles}
      />
    );
  }
}

export default AccountManagerContainer;
