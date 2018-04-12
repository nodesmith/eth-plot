import * as Enums from '../constants/Enums';

export interface UserTransactions {
  txType: Enums.TxType;
  txStatus: Enums.TxStatus;
  blockNumber: number;
  txHash: string;
}

export interface AccountState {
  metamaskStateKnown: boolean,
  metamaskState: Enums.METAMASK_STATE,
  activeAccount: string,
  userTransactions: { [hash: string]: UserTransactions },
  notificationCount: number,
  isFetchingTransactions: boolean
}
