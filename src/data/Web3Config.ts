import * as jsCookie from 'js-cookie';
import * as queryString from 'query-string';

import { ContractInfo } from '../models/Contract';

export function getWeb3Config(): ContractInfo {
  const web3ConfigFromCookie = <ContractInfo>jsCookie.getJSON('web3Config')!;
  if (!!web3ConfigFromCookie) {
    return web3ConfigFromCookie;
  }

  const parsedQueryString = typeof window !== 'undefined' ? queryString.parse(window.location.search) : undefined;
  if (parsedQueryString && 'contractAddress' in parsedQueryString && 'web3Provider' in parsedQueryString) {
    return parsedQueryString;
  }
  
  return {
    contractAddress: 'unknown',
    web3Provider: 'unknown'
  };
}
