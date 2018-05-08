import * as jsCookie from 'js-cookie';

import { ContractInfo } from '../models/Contract';

export function getWeb3Config(): ContractInfo {
  const web3Config = <ContractInfo>jsCookie.getJSON('web3Config')!;
  if (!web3Config) {
    return {
      contractAddress: 'unknown',
      web3Provider: 'unknown'
    };
  }
  
  return web3Config;
}
