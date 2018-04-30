import * as Web3 from 'web3';

import { ContractInfo } from '../models';

declare global {
  interface Window { web3: Web3; }
}

export function getWeb3(contractInfo: ContractInfo): Web3 {
  if (typeof window.web3 !== 'undefined') {
    return window.web3;
  } else {
    return new Web3(new Web3.providers.HttpProvider(contractInfo.web3Provider));
  }
}

export function isUsingMetamask(): boolean {
  return typeof window.web3 !== 'undefined';
}
