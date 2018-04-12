import * as Enums from '../constants/Enums';

export interface UserTransactions {
  txType: Enums.TxType;
  txStatus: Enums.TxStatus;
  blockNumber: number;
  txHash: string;
}
