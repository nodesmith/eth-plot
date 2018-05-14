import * as Enums from '../constants/Enums';

export interface UserTransaction {
  txType: Enums.TxType;
  txStatus: Enums.TxStatus;
  blockNumber: number;
  txHash: string;
}
