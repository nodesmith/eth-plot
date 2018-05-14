import * as jsCookie from 'js-cookie';
import * as queryString from 'query-string';

import { ContractInfo } from '../models/Contract';

declare global {
  interface Window { _web3Config: ContractInfo; }
}

// Grabs some info about how web3 and our contract is configured. Tries first a query string, then a cookie, then a global config
export function getWeb3Config(): ContractInfo {
  const parsedQueryString = typeof window !== 'undefined' ? queryString.parse(window.location.search) : undefined;
  if (parsedQueryString && 'contractAddress' in parsedQueryString && 'web3Provider' in parsedQueryString) {
    return parsedQueryString;
  }
  
  const web3ConfigFromCookie = <ContractInfo>jsCookie.getJSON('web3Config')!;
  if (!!web3ConfigFromCookie) {
    return web3ConfigFromCookie;
  }

  if (typeof window !== 'undefined' && typeof window._web3Config === 'object') {
    return window._web3Config;
  }

  return {
    contractAddress: 'unknown',
    web3Provider: 'unknown'
  };
}
